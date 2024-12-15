import fs from "node:fs";

const isSample = false;
const fileName = isSample ? "sample.txt" : "input.txt";

const input: string = fs.readFileSync(__dirname + "/" + fileName, "utf8");

/**
 * PART 1
 */
const parsedInput = input
    .split("\n")
    .map((line) =>
        line
            .split(" ")
            .map((line) =>
                line.replace("p=", "").replace("v=", "").split(",").map(Number),
            ),
    );

type Robot = {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
};

let robots: Robot[] = parsedInput.map((line) => ({
    position: { x: line[0][0], y: line[0][1] },
    velocity: { x: line[1][0], y: line[1][1] },
}));

const maxX = isSample ? 11 : 101;
const maxY = isSample ? 7 : 103;

const buildRobotGrid = (
    robots: Robot[],
    maxX: number,
    maxY: number,
    part2: boolean = false,
): string[][] => {
    const separator = part2 ? " " : ".";
    const grid = [];
    for (let y = 0; y < maxY; y++) {
        grid[y] = [];
        for (let x = 0; x < maxX; x++) {
            const robotCount = robots.filter(
                (robot) => robot.position.y === y && robot.position.x === x,
            ).length;
            grid[y][x] =
                robotCount > 0 ? (!part2 ? robotCount : "#") : separator;
        }
    }
    return grid;
};

const gridToString = (grid: string[][]): string => {
    return grid.map((row) => row.join("")).join("\n");
};

const moveRobots = (robots: Robot[], maxX: number, maxY: number): Robot[] => {
    return robots.map((robot) => {
        let newX = robot.position.x + robot.velocity.x;
        let newY = robot.position.y + robot.velocity.y;

        // Wrap around horizontally
        if (newX < 0) {
            newX = ((newX % maxX) + maxX) % maxX;
        } else if (newX >= maxX) {
            newX = newX % maxX;
        }

        // Wrap around vertically
        if (newY < 0) {
            newY = ((newY % maxY) + maxY) % maxY;
        } else if (newY >= maxY) {
            newY = newY % maxY;
        }

        return {
            position: {
                x: newX,
                y: newY,
            },
            velocity: robot.velocity,
        };
    });
};

const countRobotsInQuadrants = (
    robots: Robot[],
    maxX: number,
    maxY: number,
): number[] => {
    const centerX = Math.floor(maxX / 2);
    const centerY = Math.floor(maxY / 2);

    // Quadrant counts
    const counts = [0, 0, 0, 0];

    robots.forEach((robot) => {
        const { x, y } = robot.position;

        // Exclude robots on center lines
        if (x === centerX || y === centerY) {
            return;
        }

        if (x < centerX && y < centerY) {
            counts[0]++; // Top-Left (Quadrant 1)
        } else if (x >= centerX && y < centerY) {
            counts[1]++; // Top-Right (Quadrant 2)
        } else if (x < centerX && y >= centerY) {
            counts[2]++; // Bottom-Left (Quadrant 3)
        } else if (x >= centerX && y >= centerY) {
            counts[3]++; // Bottom-Right (Quadrant 4)
        }
    });

    return counts;
};

for (let i = 1; i <= 100; i++) {
    robots = moveRobots(robots, maxX, maxY);
}

const quadrantCounts = countRobotsInQuadrants(robots, maxX, maxY);
console.log("Robots in each quadrant:", quadrantCounts);

const safetyFactor = quadrantCounts.reduce(
    (product, count) => product * count,
    1,
);
console.log("Safety Factor:", safetyFactor);

/**
 * PART 2
 */
let robots2: Robot[] = parsedInput.map((line) => ({
    position: { x: line[0][0], y: line[0][1] },
    velocity: { x: line[1][0], y: line[1][1] },
}));
let strGrid = "";
for (let i = 1; i <= 10000; i++) {
    robots2 = moveRobots(robots2, maxX, maxY);
    strGrid = gridToString(buildRobotGrid(robots2, maxX, maxY, true));
    if (strGrid.includes("#########")) {
        console.log(`Found the three after ${i} seconds`);
        console.log(strGrid);
        break;
    }
}
