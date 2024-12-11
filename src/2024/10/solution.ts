import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const map = input.split("\n").map((line) => line.split("").map(Number));

const dfs = (
    map: number[][],
    x: number,
    y: number,
    visited: Set<string>,
    previousValue: number,
    allPaths: boolean = false,
): number => {
    if (
        (!allPaths && visited.has(`${x},${y}`)) ||
        x < 0 ||
        y < 0 ||
        x > map.length - 1 ||
        y > map[x].length - 1 ||
        map[x][y] - previousValue !== 1
    ) {
        return 0;
    }

    if (!allPaths) {
        visited.add(`${x},${y}`);
    }

    if (map[x][y] === 9) {
        return 1;
    }

    return (
        dfs(map, x + 1, y, visited, map[x][y], allPaths) +
        dfs(map, x - 1, y, visited, map[x][y], allPaths) +
        dfs(map, x, y + 1, visited, map[x][y], allPaths) +
        dfs(map, x, y - 1, visited, map[x][y], allPaths)
    );
};

let totalScore = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 0) {
            totalScore += dfs(map, y, x, new Set<string>(), -1);
        }
    }
}
console.log(`Total score: ${totalScore}`);

/**
 * PART 2
 */
let totalRatings = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 0) {
            totalRatings += dfs(map, y, x, new Set<string>(), -1, true);
        }
    }
}
console.log(`Total ratings: ${totalRatings}`);
