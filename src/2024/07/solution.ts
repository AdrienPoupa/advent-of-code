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

enum Operator {
    ADDITION = "+",
    MULTIPLICATION = "*",
}

const isSolvable = (expectedTotal: number, numbers: number[]): boolean => {
    const recurse = (
        index: number,
        operator: Operator,
        total: number,
    ): number => {
        const newTotal =
            // Special case for index 0 to avoid multiplying by 0, nulling the result
            index === 0
                ? numbers[index]
                : operator === Operator.ADDITION
                  ? total + numbers[index]
                  : total * numbers[index];

        if (index + 1 === numbers.length) {
            return newTotal;
        }

        const additionResult = recurse(index + 1, Operator.ADDITION, newTotal);
        // Optimize by returning early if the addition result is the expected total
        if (additionResult === expectedTotal) {
            return additionResult;
        }

        return recurse(index + 1, Operator.MULTIPLICATION, newTotal);
    };

    return recurse(0, Operator.ADDITION, 0) === expectedTotal;
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
