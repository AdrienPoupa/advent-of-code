import fs from "node:fs";

const isSample = false;
const fileName = isSample ? "sample.txt" : "input.txt";

const input: string = fs.readFileSync(__dirname + "/" + fileName, "utf8");

/**
 * PART 1
 */
const parsedInput = input.split("\n").map((line) => line.split(""));

enum Direction {
    Up = "^",
    Down = "v",
    Left = "<",
    Right = ">",
}

const directionDeltas = {
    [Direction.Up]: [-1, 0],
    [Direction.Down]: [1, 0],
    [Direction.Left]: [0, -1],
    [Direction.Right]: [0, 1],
};

const rotateClockwise = {
    [Direction.Up]: Direction.Right,
    [Direction.Right]: Direction.Down,
    [Direction.Down]: Direction.Left,
    [Direction.Left]: Direction.Up,
};

const rotateCounterClockwise = {
    [Direction.Up]: Direction.Left,
    [Direction.Left]: Direction.Down,
    [Direction.Down]: Direction.Right,
    [Direction.Right]: Direction.Up,
};

const findPosition = (grid: string[][], symbol: string): [number, number] => {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === symbol) return [y, x];
        }
    }
    return [-1, -1];
};

function dijkstraAlgorithm(map: string[][]) {
    const [startY, startX] = findPosition(map, "S");
    const [endY, endX] = findPosition(map, "E");

    const costs = new Map<string, number>();
    const queue: {
        x: number;
        y: number;
        direction: Direction;
        cost: number;
    }[] = [];

    const startDirection = Direction.Right;
    queue.push({ x: startX, y: startY, direction: startDirection, cost: 0 });
    costs.set(`${startX},${startY},${startDirection}`, 0);

    const visited = new Set<string>();

    while (queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost);
        const { x, y, direction, cost } = queue.shift();
        const stateKey = `${x},${y},${direction}`;

        if (visited.has(stateKey)) {
            continue;
        }
        visited.add(stateKey);

        // Check if we reached the end
        if (x === endX && y === endY) {
            return cost;
        }

        // Move forward
        const [dy, dx] = directionDeltas[direction];
        const newX = x + dx;
        const newY = y + dy;
        if (isPositionValid(map, newX, newY)) {
            const forwardKey = `${newX},${newY},${direction}`;
            const forwardCost = cost + 1;
            if (
                !costs.has(forwardKey) ||
                forwardCost < costs.get(forwardKey)!
            ) {
                costs.set(forwardKey, forwardCost);
                queue.push({ x: newX, y: newY, direction, cost: forwardCost });
            }
        }

        // Turn clockwise
        const clockwiseDirection = rotateClockwise[direction];
        const clockwiseKey = `${x},${y},${clockwiseDirection}`;
        const clockwiseCost = cost + 1000;
        if (
            !costs.has(clockwiseKey) ||
            clockwiseCost < costs.get(clockwiseKey)!
        ) {
            costs.set(clockwiseKey, clockwiseCost);
            queue.push({
                x,
                y,
                direction: clockwiseDirection,
                cost: clockwiseCost,
            });
        }

        // Turn counterclockwise
        const counterDirection = rotateCounterClockwise[direction];
        const counterKey = `${x},${y},${counterDirection}`;
        const counterCost = cost + 1000;
        if (!costs.has(counterKey) || counterCost < costs.get(counterKey)!) {
            costs.set(counterKey, counterCost);
            queue.push({
                x,
                y,
                direction: counterDirection,
                cost: counterCost,
            });
        }
    }
    return Infinity; // If no path is found
}

const isPositionValid = (map: string[][], x: number, y: number) => {
    return (
        x >= 0 &&
        y >= 0 &&
        y < map.length &&
        x < map[0].length &&
        map[y][x] !== "#"
    );
};

const result = dijkstraAlgorithm(parsedInput);
console.log("Best path score: ", result);
