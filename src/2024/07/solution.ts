import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const inputLines = input
    .split("\n")
    .map((line) => line.split(": "))
    .map((line) => [Number(line[0]), line[1].split(" ").map(Number)]) as [
    number,
    number[],
];

const isSolvable = (expectedTotal: number, numbers: number[]): boolean => {
    const recurse = (index: number, currentTotal: number): boolean => {
        if (index === numbers.length || currentTotal > expectedTotal) {
            return currentTotal === expectedTotal;
        }

        const nextNumber = numbers[index];

        if (recurse(index + 1, currentTotal + nextNumber)) {
            return true;
        }

        return recurse(index + 1, currentTotal * nextNumber);
    };

    return recurse(1, numbers[0]);
};

const solvableLines = inputLines.filter((line) => isSolvable(line[0], line[1]));

const solvableLinesTotal = solvableLines.reduce(
    (acc, line) => acc + line[0],
    0,
);

console.log("Calibration result: " + solvableLinesTotal);

/**
 * PART 2
 */
const isSolvableWithConcat = (
    expectedTotal: number,
    numbers: number[],
): boolean => {
    const recurse = (index: number, currentTotal: number): boolean => {
        if (index === numbers.length || currentTotal > expectedTotal) {
            return currentTotal === expectedTotal;
        }

        const nextNumber = numbers[index];

        if (recurse(index + 1, currentTotal + nextNumber)) {
            return true;
        }

        if (recurse(index + 1, currentTotal * nextNumber)) {
            return true;
        }

        const nextPowerOf10 = Math.pow(
            10,
            Math.floor(Math.log10(nextNumber) + 1),
        );
        const concatenatedTotal = currentTotal * nextPowerOf10 + nextNumber;

        return recurse(index + 1, concatenatedTotal);
    };

    return recurse(1, numbers[0]);
};

const unsolvableLines = inputLines.filter(
    (line) => !isSolvable(line[0], line[1]),
);

const solvableLinesTotalWithConcat = unsolvableLines.filter((line) =>
    isSolvableWithConcat(line[0], line[1]),
);

const allSolvableLinesTotal =
    solvableLinesTotal +
    solvableLinesTotalWithConcat.reduce((acc, line) => acc + line[0], 0);

console.log("Total calibration result: " + allSolvableLinesTotal);
