import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const grid = input.split("\n").map((line) => line.split(""));

const findStart = (grid: string[][]): [number, number] => {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "^") {
                return [y, x];
            }
        }
    }
    return [-1, -1];
};

enum Direction {
    Up = "^",
    Down = "v",
    Left = "<",
    Right = ">",
}

const nextDirection = (direction: Direction): Direction => {
    switch (direction) {
        case Direction.Up:
            return Direction.Right;
        case Direction.Right:
            return Direction.Down;
        case Direction.Down:
            return Direction.Left;
        case Direction.Left:
            return Direction.Up;
    }
};

const nextMove = (
    x: number,
    y: number,
    direction: Direction,
): [number, number] => {
    switch (direction) {
        case Direction.Up:
            return [x - 1, y];
        case Direction.Down:
            return [x + 1, y];
        case Direction.Left:
            return [x, y - 1];
        case Direction.Right:
            return [x, y + 1];
    }
};

const isValidPosition = (grid: string[][], x: number, y: number): boolean =>
    x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;

const traverse = (grid: string[][], startX: number, startY: number): number => {
    const positions = new Set<string>();
    positions.add(`${startX},${startY}`);

    let x = startX;
    let y = startY;
    let direction = Direction.Up;

    while (isValidPosition(grid, x, y)) {
        const [nextX, nextY] = nextMove(x, y, direction);

        if (!isValidPosition(grid, nextX, nextY)) {
            break;
        }

        if (grid[nextX][nextY] === "#") {
            direction = nextDirection(direction);
        } else {
            x = nextX;
            y = nextY;
            const posKey = `${x},${y}`;
            positions.add(posKey);
        }
    }

    return positions.size;
};

const [startX, startY] = findStart(grid);

const positions = traverse(grid, startX, startY);

console.log("Number of traversed positions: " + positions);

/**
 * PART 2
 */
const hasLoop = (grid: string[][], startX: number, startY: number): boolean => {
    let x = startX;
    let y = startY;
    let direction = Direction.Up;

    const positions = new Set<string>();
    positions.add(`${startX},${startY},${direction}`);

    while (isValidPosition(grid, x, y)) {
        const [nextX, nextY] = nextMove(x, y, direction);

        if (!isValidPosition(grid, nextX, nextY)) {
            break;
        }

        if (grid[nextX][nextY] === "#") {
            direction = nextDirection(direction);
        } else {
            x = nextX;
            y = nextY;
            const posKey = `${x},${y},${direction}`;
            if (positions.has(posKey)) {
                return true;
            }
            positions.add(posKey);
        }
    }

    return false;
};

const deepCopyGrid = (grid: string[][]): string[][] => {
    return grid.map((row) => [...row]);
};

let nbLoops = 0;

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        const currentGrid = deepCopyGrid(grid);
        currentGrid[y][x] = "#";
        hasLoop(currentGrid, startX, startY) ? nbLoops++ : null;
    }
}

console.log("Number of loops: " + nbLoops);
