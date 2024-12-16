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

const calculateGPSCoordinates = (grid: string[][], symbol: string): number => {
    let acc = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === symbol) {
                acc += 100 * y + x;
            }
        }
    }
    return acc;
};

const grid = performMoves(deepCopyGrid(initialGrid), moves);

console.log("Sum of GPS coordinates: " + calculateGPSCoordinates(grid, "O"));

/**
 * PART 2
 */
const buildLargerGrid = (grid: string[][]): string[][] => {
    const newGrid = [...Array(grid.length)].map((_) =>
        Array(2 * grid[0].length),
    );
    for (let y = 0; y < grid.length; y++) {
        let lastX = 0;
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "#") {
                newGrid[y][lastX] = "#";
                newGrid[y][lastX + 1] = "#";
            }
            if (grid[y][x] === "O") {
                newGrid[y][lastX] = "[";
                newGrid[y][lastX + 1] = "]";
            }
            if (grid[y][x] === ".") {
                newGrid[y][lastX] = ".";
                newGrid[y][lastX + 1] = ".";
            }
            if (grid[y][x] === "@") {
                newGrid[y][lastX] = "@";
                newGrid[y][lastX + 1] = ".";
            }
            lastX += 2;
        }
    }
    return newGrid;
};

// Credits: https://github.com/darrenortiz77/aoc/blob/main/src/2024/15/p2.ts
// I tried on my own, managed to get small example working, but not the larger, rip.
const findMatchingBlocks = (
    grid: string[][],
    current: [number, number],
    blocks: [number, number][],
    direction: Direction,
): [number, number][] | false => {
    let [nextPositionY, nextPositionX] = getNextPosition(current, direction);
    let nextCellValue = grid[nextPositionY][nextPositionX];

    // LEFT or RIGHT
    if (direction === Direction.Left || direction === Direction.Right) {
        if (nextCellValue === "#") {
            return false;
        } else if (nextCellValue === "]" && direction === Direction.Left) {
            return findMatchingBlocks(
                grid,
                [nextPositionY, nextPositionX - 1],
                [...blocks, [nextPositionY, nextPositionX - 1]],
                direction,
            );
        } else if (nextCellValue === "[" && direction === Direction.Right) {
            return findMatchingBlocks(
                grid,
                [nextPositionY, nextPositionX + 1],
                [...blocks, [nextPositionY, nextPositionX]],
                direction,
            );
        } else if (nextCellValue === ".") {
            return blocks;
        }
    } else if (direction === Direction.Up || direction === Direction.Down) {
        if (nextCellValue === "#") {
            return false;
        } else if (nextCellValue === "]") {
            const leftStack = findMatchingBlocks(
                grid,
                [nextPositionY, nextPositionX - 1],
                [...blocks, [nextPositionY, nextPositionX - 1]],
                direction,
            );
            if (leftStack !== false) {
                return findMatchingBlocks(
                    grid,
                    [nextPositionY, nextPositionX],
                    [...leftStack],
                    direction,
                );
            } else {
                return false;
            }
        } else if (nextCellValue === "[") {
            const rightStack = findMatchingBlocks(
                grid,
                [nextPositionY, nextPositionX + 1],
                [...blocks, [nextPositionY, nextPositionX]],
                direction,
            );
            if (rightStack !== false) {
                return findMatchingBlocks(
                    grid,
                    [nextPositionY, nextPositionX],
                    [...rightStack],
                    direction,
                );
            } else {
                return false;
            }
        } else if (nextCellValue === ".") {
            return blocks;
        }
    }

    return blocks;
};

const performMoves2 = (grid: string[][], moves: Direction[]): string[][] => {
    let [robotX, robotY] = findStart(grid);

    for (let move of moves) {
        let [newX, newY] = getNextPosition([robotX, robotY], move);

        if (newX < 0 || newY >= grid[0].length || grid[newX][newY] === "#") {
            continue;
        }

        if (grid[newX][newY] === "[" || grid[newX][newY] === "]") {
            const matchingBlocks = findMatchingBlocks(
                grid,
                [robotX, robotY],
                [],
                move,
            );
            if (matchingBlocks === false || matchingBlocks.length === 0) {
                continue;
            }
            matchingBlocks.sort((a, b) => {
                switch (move) {
                    case Direction.Left:
                        return b[1] - a[1];
                    case Direction.Right:
                        return a[1] - b[1];
                    case Direction.Up:
                        return b[0] - a[0];
                    case Direction.Down:
                        return a[0] - b[0];
                }
            });
            while (matchingBlocks.length) {
                const [y, x] = matchingBlocks.pop()!;
                switch (move) {
                    case Direction.Left:
                        grid[y][x + 1] = ".";
                        grid[y][x] = "]";
                        grid[y][x - 1] = "[";
                        break;
                    case Direction.Right:
                        grid[y][x] = ".";
                        grid[y][x + 1] = "[";
                        grid[y][x + 2] = "]";
                        break;
                    case Direction.Up:
                        grid[y - 1][x] = "[";
                        grid[y - 1][x + 1] = "]";
                        grid[y][x] = ".";
                        grid[y][x + 1] = ".";
                        break;
                    case Direction.Down:
                        grid[y + 1][x] = "[";
                        grid[y + 1][x + 1] = "]";
                        grid[y][x] = ".";
                        grid[y][x + 1] = ".";
                        break;
                }
            }
        }
        grid[robotX][robotY] = ".";
        grid[newX][newY] = "@";
        robotX = newX;
        robotY = newY;
    }
    return grid;
};

const largerGrid = buildLargerGrid(initialGrid);

const finalGrid = performMoves2(largerGrid, moves);

console.log(
    "Sum of GPS coordinates for the larger map: " +
        calculateGPSCoordinates(finalGrid, "["),
);
