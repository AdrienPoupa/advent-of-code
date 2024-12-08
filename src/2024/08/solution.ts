import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const map = input.split("\n").map((line) => line.split(""));

type Point = {
    x: number;
    y: number;
};

const frequencies = new Map<string, Point[]>();

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] !== ".") {
            const point = { x, y };
            frequencies.set(map[y][x], [
                ...(frequencies.get(map[y][x]) || []),
                point,
            ]);
        }
    }
}

const antinodes = new Set<string>();

const isValidAntinode = (antinode: Point, map: string[][]): boolean =>
    antinode.x >= 0 &&
    antinode.x < map[0].length &&
    antinode.y >= 0 &&
    antinode.y < map.length;

for (let [_frequency, antennas] of frequencies) {
    for (const antenna of antennas) {
        const otherAntennas = antennas.filter(
            (a) => a.x !== antenna.x && a.y !== antenna.y,
        );
        for (const otherAntenna of otherAntennas) {
            const distance: Point = {
                x: antenna.x - otherAntenna.x,
                y: antenna.y - otherAntenna.y,
            };

            const antinode: Point = {
                x: antenna.x + distance.x,
                y: antenna.y + distance.y,
            };

            if (isValidAntinode(antinode, map)) {
                antinodes.add(`${antinode.x},${antinode.y}`);
            }
        }
    }
}

console.log(`Number of antinodes: ${antinodes.size}`);

/**
 * PART 2
 */

const improvedAntinodes = new Set<string>();

for (let [_frequency, antennas] of frequencies) {
    for (const antenna of antennas) {
        improvedAntinodes.add(`${antenna.x},${antenna.y}`);

        const otherAntennas = antennas.filter(
            (a) => a.x !== antenna.x && a.y !== antenna.y,
        );

        for (const otherAntenna of otherAntennas) {
            const distance: Point = {
                x: antenna.x - otherAntenna.x,
                y: antenna.y - otherAntenna.y,
            };

            const antinode: Point = {
                x: antenna.x + distance.x,
                y: antenna.y + distance.y,
            };

            while (isValidAntinode(antinode, map)) {
                improvedAntinodes.add(`${antinode.x},${antinode.y}`);

                antinode.x += distance.x;
                antinode.y += distance.y;
            }
        }
    }
}

console.log(`Number of improved antinodes: ${improvedAntinodes.size}`);
