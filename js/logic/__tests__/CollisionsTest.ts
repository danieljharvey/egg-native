import { Coords } from "../../objects/Coords";
import { Player } from "../../objects/Player";
import * as Collisions from "../Collisions";

import { playerTypes } from "../PlayerTypes"

import { fromJS, List } from "immutable";

test("Ignores same player collision test", () => {
  const player1 = new Player();

  const result = Collisions.checkCollision(player1, player1);
  expect(result).toEqual(false);
});

test("Vertical collision works", () => {
  const player1 = new Player({
    coords: new Coords({ x: 1, y: 1, offsetX: 0, offsetY: 0 }),
    falling: true,
    id: 1,
    type: "Horse"
  });

  const player2 = new Player({
    coords: new Coords({ x: 1, y: 1, offsetX: 0, offsetY: 0 }),
    falling: false,
    id: 2,
    type: "Horse"
  });

  const result = Collisions.checkCollision(player1, player2);
  expect(result).toEqual(true);
});

test("Too far for horizontal collision", () => {
  const player1 = new Player({
    coords: new Coords({ x: 5, y: 5, offsetX: 1, offsetY: 0 }),
    falling: false,
    id: 1,
    type: "Horse"
  });
  const player2 = new Player({
    coords: new Coords({ x: 6, y: 5, offsetX: -70, offsetY: 0 }),
    falling: false,
    id: 2,
    type: "Horse"
  });

  // difference of 30

  const result = Collisions.checkCollision(player1, player2);
  expect(result).toEqual(false);
});

test("Close enough for RHS horizontal collision", () => {
  const player1 = new Player({
    coords: new Coords({ x: 5, y: 5, offsetX: 41, offsetY: 0 }),
    falling: false,
    id: 1,
    type: "Horse"
  });
  const player2 = new Player({
    coords: new Coords({ x: 6, y: 5, offsetX: -41, offsetY: 0 }),
    falling: false,
    id: 2,
    type: "Horse"
  });

  // difference of 18

  const result = Collisions.checkCollision(player1, player2);
  expect(result).toEqual(true);
});

test("Close enough for LHS horizontal collision", () => {
  const player1 = new Player({
    coords: new Coords({ x: 6, y: 5, offsetX: -80, offsetY: 0 }),
    falling: false,
    id: 1,
    type: "Horse"
  });
  const player2 = new Player({
    coords: new Coords({ x: 5, y: 5, offsetX: 0, offsetY: 0 }),
    falling: false,

    id: 2,
    type: "Horse"
  });

  // difference of 19

  const result = Collisions.checkCollision(player1, player2);
  expect(result).toEqual(true);
});

test("Ignores collision with zero-value player", () => {
  const player1 = new Player({
    coords: new Coords({ x: 1, y: 1 })
  });

  const zeroValuePlayer = player1.modify({ value: 0, id: 100 });

  const result = Collisions.checkCollision(player1, zeroValuePlayer);
  expect(result).toEqual(false);
});

test("Ignores collision with just-split player", () => {
  const player1 = new Player({
    coords: new Coords({ x: 1, y: 1 }),
    lastAction: "split"
  });

  const splitPlayer = player1.modify({ id: 100 });

  const result = Collisions.checkCollision(player1, splitPlayer);
  expect(result).toEqual(false);
});

test("Removes correct players", () => {
  const player1 = new Player({
    id: 1
  });

  const player2 = new Player({
    id: 2
  });

  const players = [player1, player2];

  const expected = [player1];

  const collided = [[2, 3], [4, 5]];

  const actual = Collisions.removeCollidedPlayers(collided, players);

  expect(actual).toEqual(expected);
});

test("Combine two players", () => {
  const player1 = new Player({
    id: 1,
    value: 1,
    coords: new Coords({
      x: 100,
      y: 100
    })
  });

  const player2 = new Player({
    id: 2,
    value: 1,
    coords: new Coords({
      x: 6,
      y: 6
    })
  });

  const redEgg = playerTypes['red-egg']

  const expected = [
    new Player({
      ...redEgg,
      id: 1,
      value: 2,
      
      coords: new Coords({
        x: 100,
        y: 100
      })
    })
  ];

  const actual = Collisions.combinePlayers(player1, player2);

  expect(actual).toEqual(expected);
});

test("Create no new players as no type found", () => {
  const player1 = new Player({
    id: 1,
    value: 10,
    coords: new Coords({
      x: 100,
      y: 100
    })
  });

  const player2 = new Player({
    id: 2,
    value: 5,
    coords: new Coords({
      x: 6,
      y: 6
    })
  });

  const types = {};

  const expected = [player1, player2];

  const actual = Collisions.combinePlayers(player1, player2);

  expect(actual).toEqual(expected);
});

test("Find collisions", () => {
  const players = [
    new Player({ id: 1, coords: new Coords({ x: 1, y: 1 }) }),
    new Player({ id: 2, coords: new Coords({ x: 1, y: 1 }) }),
    new Player({ id: 3, coords: new Coords({ x: 10, y: 10 }) })
  ];

  const combinations = [[1, 2], [1, 3], [2, 3]];

  const expected = [[1, 2]];

  const actual = Collisions.findCollisions(combinations, players);

  expect(actual).toEqual(expected);
});

test("Fetch player by ID", () => {
  const players = [
    new Player({ id: 1 }),
    new Player({ id: 2 }),
    new Player({ id: 3 })
  ];

  const expected = new Player({ id: 2 });

  const actual = Collisions.fetchPlayerByID(players, 2);

  expect(actual).toEqual(expected);
});

test("Fetch player by ID Immutable", () => {
  const players = fromJS([
    new Player({ id: 1 }),
    new Player({ id: 2 }),
    new Player({ id: 3 })
  ]);

  const expected = new Player({ id: 2 });

  const actual = Collisions.fetchPlayerByID(players, 2);

  expect(actual).toEqual(expected);
});

test("Get all player combinations", () => {
  const players = [
    new Player({ id: 1 }),
    new Player({ id: 4 }),
    new Player({ id: 2 })
  ];

  const expected = [[1, 4], [1, 2], [2, 4]];

  const actual = Collisions.getAllPlayerCombinations(players);

  expect(actual).toEqual(expected);
});

test("Get all player combinations from Immutable List", () => {
  const playersJS = [
    new Player({ id: 1 }),
    new Player({ id: 4 }),
    new Player({ id: 2 })
  ];

  const players = fromJS(playersJS);

  const expected = [[1, 4], [1, 2], [2, 4]];

  const actual = Collisions.getAllPlayerCombinations(players);

  expect(actual).toEqual(expected);
});

test("Clean combos of immutable", () => {
  const plop1 = fromJS([2, 4]);

  const plop2 = [2, 4];

  const expected = [2, 4];

  const actual1 = Collisions.cleanCombos(plop1);

  const actual2 = Collisions.cleanCombos(plop2);

  expect(actual1).toEqual(expected);
  expect(actual2).toEqual(expected);
});

test("Create new players actually works", () => {
  const player1 = new Player({
    id: 1,
    value: 1,
    coords: new Coords({
      x: 100,
      y: 100
    })
  });

  const player2 = new Player({
    id: 2,
    value: 1,
    coords: new Coords({
      x: 6,
      y: 6
    })
  });

  const player3 = new Player({
    id: 3,
    value: 5,
    coords: new Coords({
      x: 102,
      y: 102
    })
  });

  const redEgg = playerTypes['red-egg']

  const expected = [
    new Player({
      ...redEgg,
      id: 1,
      coords: new Coords({
        x: 100,
        y: 100
      })
    })
  ];

  const players = [player1, player2, player3];

  const collided = [[1, 2], [4, 6]];

  const actual = Collisions.createNewPlayers(collided, players);

  expect(actual).toEqual(expected);
});

test("Combine player lists", () => {
  const player1 = new Player({
    id: 1,
    value: 10,
    coords: new Coords({
      x: 100,
      y: 100
    })
  });

  const player2 = new Player({
    id: 2,
    value: 5,
    coords: new Coords({
      x: 6,
      y: 6
    })
  });

  const player3 = new Player({
    id: 3,
    value: 5,
    coords: new Coords({
      x: 100,
      y: 100
    })
  });

  const list1 = [player1, player2];

  const list2 = fromJS([player3]);

  const expected = fromJS([player1, player2, player3]);

  const actual = Collisions.combinePlayerLists(list1, list2);

  expect(actual).toEqual(expected);
});
