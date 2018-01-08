import * as _ from "ramda";

import { Board } from "../objects/Board";
import { BoardSize } from "../objects/BoardSize";
import CanvasClass from "./Canvas";

import { Coords } from "../objects/Coords";
import { GameState } from "../objects/GameState";
import { Levels } from "./Levels";

import { Loader } from "../interact/Loader";
import * as Map from "../logic/Map";
import { Player } from "../objects/Player";

import { playerTypes } from "../logic/PlayerTypes";

import { Renderer } from "../interact/Renderer";
import { RenderMap } from "../logic/RenderMap";
import { SavedLevel } from "../logic/SavedLevel";
import * as TheEgg from "../logic/TheEgg";
import { Tile } from "../objects/Tile";

import { TileSet } from "../logic/TileSet";
import { Utils } from "../logic/Utils";

export class Jetpack {
  public animationHandle: number;
  public moveSpeed: number = 10;
  public players: Player[];

  protected paused: boolean = true;
  protected editMode: boolean = false;

  protected levelID: number = 1;
  protected levelList: number[] = [];

  protected renderer: Renderer; // Renderer object
  protected levels: Levels; // Levels object
  protected boardSize: BoardSize; // BoardSize object
  protected canvas: CanvasClass; // Canvas object

  // big pile of moves
  protected gameStates: GameState[];

  protected nextPlayerID: number = 1;
  protected score: number = 0;
  protected rotationsUsed: number = 0;
  protected collectable: number = 0; // total points on screen

  protected defaultBoardSize: number = 20;
  protected checkResize: boolean = false;

  protected isCalculating = false;
  protected action: string = "";

  // create player
  public createNewPlayer(
    playerTypes,
    type: string,
    coords: Coords,
    direction: Coords
  ): Player {
    const playerType = playerTypes[type];
    const params = JSON.parse(JSON.stringify(playerType));
    params.id = this.nextPlayerID++;
    params.coords = coords;
    params.direction = direction;
    if (!Object.hasOwnProperty.call(params, "moveSpeed")) {
      params.moveSpeed = this.moveSpeed;
      params.fallSpeed = this.moveSpeed * 1.2;
    }
    const player = new Player(params);
    return player;
  }

  protected getLevelList(callback) {
    this.levels.getLevelList(levelList => {
      this.levelList = levelList;
      callback(levelList);
    });
  }

  // select a random level that has not been completed yet
  // a return of false means none available (generate a random one)
  protected chooseLevelID(levelList) {
    const availableLevels = levelList.filter(level => {
      return level.completed === false;
    });
    const chosenKey = Utils.getRandomArrayKey(availableLevels);
    if (!chosenKey) {
      return false;
    }
    const levelID = availableLevels[chosenKey].levelID;
    return levelID;
  }

  protected getBoardFromArray(boardArray): Board {
    return Map.makeBoardFromArray(boardArray);
  }

  // create first "frame" of gameState from board
  // create players etc
  protected getBlankGameState(board: Board): GameState {
    const players = this.createPlayers(playerTypes, board);
    return new GameState({
      board,
      players
    });
  }

  // current game state from array
  protected getCurrentGameState() {
    return this.gameStates.slice(-1)[0]; // set to new last item
  }

  protected resetGameState(board: Board) {
    const gameState = this.getBlankGameState(board);
    this.gameStates = [gameState];
  }

  protected updateGameState(oldGameState: GameState, gameState: GameState) {
    this.gameStates = [oldGameState, gameState];
  }

  // do next move, plop new state on pile, return new state
  protected getNewGameState(
    gameState: GameState,
    action: string,
    timePassed: number
  ): GameState {
    const theEgg = new TheEgg(playerTypes);
    const newGameState = theEgg.doAction(gameState, action, timePassed);
    this.updateGameState(gameState, newGameState);
    this.playSounds(gameState, newGameState);
    return newGameState;
  }

  // check changes in board, get sounds, trigger them
  protected playSounds(oldState: GameState, newState: GameState) {
    _.map(
      sound =>
        sound.caseOf({
          just: audio => this.webAudio.playSound(audio.name, audio.pan),
          nothing: () => {
            // don't play a sound
          }
        }),
      AudioTriggers.triggerSounds(oldState)(newState)
    );
  }

  protected renderEverything(gameState: GameState) {
    const boardSize = new BoardSize(gameState.board.getLength());
    const blankMap = RenderMap.createRenderMap(boardSize.width, true);
    this.renderer.render(
      gameState.board,
      blankMap,
      gameState.players,
      gameState.rotateAngle
    );
  }

  protected renderChanges(oldGameState: GameState, newGameState: GameState) {
    const boardSize = new BoardSize(newGameState.board.getLength());

    // if rotated everything changes anyway
    if (oldGameState.rotateAngle !== newGameState.rotateAngle) {
      return this.renderEverything(newGameState);
    }

    // player map is covering old shit up
    const playerRenderMap = this.createRenderMapFromPlayers(
      oldGameState.players,
      boardSize
    );

    // render changes
    const boardRenderMap = RenderMap.createRenderMapFromBoards(
      oldGameState.board,
      newGameState.board
    );

    const finalRenderMap = RenderMap.combineRenderMaps(
      playerRenderMap,
      boardRenderMap
    );

    this.renderer.render(
      newGameState.board,
      finalRenderMap,
      newGameState.players,
      newGameState.rotateAngle
    );
  }

  protected sizeCanvas(boardSize: BoardSize) {
    if (!this.checkResize) {
      return false;
    }
    this.renderer.resize(boardSize);
    this.checkResize = false;
  }

  // create empty renderMap based on boardSize, and then apply each player's position to it
  protected createRenderMapFromPlayers(
    players: Player[],
    boardSize: BoardSize
  ): boolean[][] {
    const blankMap = RenderMap.createRenderMap(boardSize.width, false);
    return players.reduce((map, player) => {
      return RenderMap.addPlayerToRenderMap(player, map);
    }, blankMap);
  }

  protected calcTimePassed(time: number, lastTime: number): number {
    const difference = Math.min(time - lastTime, 20);
    return difference;
  }

  protected displayFrameRate(timePassed: number) {
    const frameRate = Math.floor(1000 / timePassed);
    const fps = document.getElementById("fps");
    if (fps) {
      fps.innerHTML = frameRate.toFixed(3) + "fps";
    }
  }

  protected nextLevel(score: number, rotations: number) {
    this.pauseRender();
    this.levels.saveData(this.levelID, rotations, score, data => {
      this.levelList = this.markLevelAsCompleted(this.levelList, this.levelID);
      this.levelID = this.chooseLevelID(this.levelList);
      this.go(this.levelID);
    });
  }

  protected markLevelAsCompleted(levelList, levelID) {
    levelList[levelID].completed = true;
    return levelList;
  }

  protected pauseRender() {
    this.paused = true;
    this.hideControls();
    window.cancelAnimationFrame(this.animationHandle);
  }

  protected showControls() {
    const controlHeader = document.getElementById("controlHeader");
    if (controlHeader && controlHeader.classList.contains("hidden")) {
      controlHeader.classList.remove("hidden");
    }
  }

  protected hideControls() {
    const controlHeader = document.getElementById("controlHeader");
    if (controlHeader && !controlHeader.classList.contains("hidden")) {
      controlHeader.classList.add("hidden");
    }
  }

  protected countPlayers(players: Player[]): number {
    return players.reduce((total, player) => {
      if (player && player.value > 0) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
  }

  protected filterCreateTiles = tiles => {
    return tiles.filter(tile => {
      return tile.createPlayer !== "";
    });
  };

  // cycle through all map tiles, find egg cups etc and create players
  protected createPlayers(playerTypes, board: Board) {
    const tiles = board.getAllTiles();

    const filtered = this.filterCreateTiles(tiles);

    const players = filtered.map((tile: Tile) => {
      const type = tile.createPlayer;
      const coords = new Coords({
        offsetX: 0,
        offsetY: 0,
        x: tile.x,
        y: tile.y
      });
      const direction = new Coords({ x: 1 });
      return this.createNewPlayer(playerTypes, type, coords, direction);
    });
    return players;
  }

  // get total outstanding points left to grab on board
  protected getCollectable(board: Board): number {
    const tiles = board.getAllTiles();
    return tiles.reduce((collectable, tile) => {
      const score = tile.get("collectable");
      if (score > 0) {
        return collectable + score;
      } else {
        return collectable;
      }
    }, 0);
  }

  protected doBoardRotation(clockwise: boolean, gameState: GameState) {
    this.renderer.drawRotatingBoard(clockwise, this.moveSpeed, () => {
      this.renderEverything(gameState);
      this.setNextAction(""); // continue playing the game
    });
  }

  protected loadLevel(levelID, callback) {
    this.levels.loadLevel(
      levelID,
      (savedLevel: SavedLevel) => {
        this.renderer = this.createRenderer(savedLevel.boardSize, () => {
          const board = this.getBoardFromArray(savedLevel.board);
          this.resetGameState(board);
          const gameState = this.getCurrentGameState();
          this.renderEverything(gameState);
          callback();
        });
      },
      () => {
        this.renderer = this.createRenderer(this.boardSize, () => {
          const board = Map.generateRandomBoard(this.boardSize);
          this.resetGameState(board);
          const gameState = this.getCurrentGameState();
          this.renderEverything(gameState);
          callback();
        });
      }
    );
  }

  protected bindSizeHandler() {
    window.addEventListener("resize", () => {
      this.checkResize = true; // as this event fires quickly - simply request system check new size on next redraw
    });
  }

  protected bindKeyboardHandler() {
    window.addEventListener("keydown", event => {
      if (event.keyCode === 37) {
        // left arrow
        this.rotateBoard(false);
      }
      if (event.keyCode === 39) {
        // right arrow
        this.rotateBoard(true);
      }
      if (event.keyCode === 80) {
        // 'p'
        this.togglePaused();
      }
      if (event.keyCode === 83) {
        // 's'
        this.doStep();
      }
      if (event.keyCode === 70) {
        // 'f'
        this.toggleFPS();
      }
    });
  }

  protected toggleFPS() {
    const fps = document.getElementById("fps");
    if (!fps) {
      return false;
    }
    if (fps.style.display !== "block") {
      fps.style.display = "block";
    } else {
      fps.style.display = "none";
    }
  }

  protected togglePaused() {
    if (this.paused) {
      this.startRender();
    } else {
      this.pauseRender();
    }
  }

  protected doStep() {
    this.gameCycle(16, this.getNextAction()); // movement based on 60 fps
  }
}
