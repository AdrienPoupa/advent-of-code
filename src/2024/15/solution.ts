import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const [gridInput, movesInput] = input.split("\n\n");

enum Direction {
    Up = "^",
    Down = "v",
    Left = "<",
    Right = ">",
}

const initialGrid = gridInput.split("\n").map((line) => line.split(""));
const moves = movesInput.replace(/(\r\n|\n|\r)/gm, "").split("") as Direction[];

const gridToString = (grid: string[][]): string => {
    return grid.map((row) => row.join("")).join("\n");
};

const deepCopyGrid = (grid: string[][]): string[][] => {
    return grid.map((row) => [...row]);
};

const findStart = (grid: string[][]): [number, number] => {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "@") {
                return [y, x];
            }
        }
    }
    return [-1, -1];
};

const getNextPosition = (
    position: [number, number],
    direction: Direction,
): [number, number] => {
    const [y, x] = position;
    switch (direction) {
        case Direction.Up:
            return [y - 1, x];
        case Direction.Down:
            return [y + 1, x];
        case Direction.Left:
            return [y, x - 1];
        case Direction.Right:
            return [y, x + 1];
        default:
            return [-1, -1];
    }
};

const performMoves = (grid: string[][], moves: Direction[]): string[][] => {
    let [robotX, robotY] = findStart(grid);

    for (let move of moves) {
        let [newX, newY] = getNextPosition([robotX, robotY], move);

        if (newX < 0 || newY >= grid.length || grid[newX][newY] === "#") {
            continue;
        }

        if (grid[newX][newY] === "O") {
            let [testX, testY] = [newX, newY];
            while (grid[testX][testY] === "O") {
                [testX, testY] = getNextPosition([testX, testY], move);
            }
            if (
                testX < 0 ||
                testY >= grid.length ||
                grid[testX][testY] === "#"
            ) {
                continue;
            }
            grid[newX][newY] = ".";
            grid[testX][testY] = "O";
        }

        grid[robotX][robotY] = ".";
        grid[newX][newY] = "@";
        robotX = newX;
        robotY = newY;
    }
    return grid;
};

const calculateGPSCoordinates = (grid: string[][]): number => {
    let acc = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O") {
                acc += 100 * y + x;
            }
        }
    }
    return acc;
};

const grid = performMoves(deepCopyGrid(initialGrid), moves);

console.log("Sum of GPS coordinates: " + calculateGPSCoordinates(grid));
