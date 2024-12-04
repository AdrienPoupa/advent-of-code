import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
function countXMASOccurrences(grid: string[]): number {
    const word = "XMAS";
    const directions = [
        { dx: 0, dy: 1 }, // Horizontal right
        { dx: 1, dy: 0 }, // Vertical down
        { dx: 1, dy: 1 }, // Diagonal down-right
        { dx: 1, dy: -1 }, // Diagonal down-left
        { dx: 0, dy: -1 }, // Horizontal left
        { dx: -1, dy: 0 }, // Vertical up
        { dx: -1, dy: -1 }, // Diagonal up-left
        { dx: -1, dy: 1 }, // Diagonal up-right
    ];

    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    // Check for the word starting at (x, y) in a specific direction
    function matches(x: number, y: number, dx: number, dy: number): boolean {
        for (let i = 0; i < word.length; i++) {
            const nx = x + i * dx;
            const ny = y + i * dy;
            if (
                !(nx >= 0 && nx < rows && ny >= 0 && y < cols) ||
                grid[nx][ny] !== word[i]
            ) {
                return false;
            }
        }
        return true;
    }

    // Traverse the grid in all directions
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            for (const { dx, dy } of directions) {
                if (matches(x, y, dx, dy)) {
                    count++;
                }
            }
        }
    }

    return count;
}

const inputLines = input.split("\n");
console.log("Number of XMAS occurrences: " + countXMASOccurrences(inputLines));

/**
 * PART 2
 */
function countXMASPatterns(grid: string[]): number {
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    // Check if a given coordinate is within bounds
    function isValid(x: number, y: number): boolean {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    }

    // Check if "MAS" exists in a given direction starting at (x, y)
    function matchesMAS(x: number, y: number, dx: number, dy: number): boolean {
        if (
            isValid(x, y) &&
            isValid(x + dx, y + dy) &&
            isValid(x + 2 * dx, y + 2 * dy)
        ) {
            const sequence =
                grid[x][y] +
                grid[x + dx][y + dy] +
                grid[x + 2 * dx][y + 2 * dy];
            return sequence === "MAS" || sequence === "SAM";
        }
        return false;
    }

    // Check for an "X-MAS" pattern with the center at (x, y)
    function isXMASPattern(x: number, y: number): boolean {
        // Check the two diagonals
        const diagonal1 = matchesMAS(x - 1, y - 1, 1, 1); // Top-left to bottom-right
        const diagonal2 = matchesMAS(x - 1, y + 1, 1, -1); // Top-right to bottom-left

        return diagonal1 && diagonal2;
    }

    // Traverse the grid and check for X-MAS patterns
    for (let x = 1; x < rows - 1; x++) {
        for (let y = 1; y < cols - 1; y++) {
            if (isXMASPattern(x, y)) {
                count++;
            }
        }
    }

    return count;
}

console.log("Number of XMAS patterns: " + countXMASPatterns(inputLines));
