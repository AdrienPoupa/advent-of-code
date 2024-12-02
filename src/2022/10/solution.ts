import fs from "node:fs";

/**
 * PART 1
 */
const instructions: string[] = fs
    .readFileSync(__dirname + "/input.txt", "utf8")
    .split("\n");

const calculateValues = function (
    instructions: string[],
    nbCycles: number,
): number[] {
    let values: number[] = [];
    let x: number = 1;
    let currentInstruction: number = 0;
    let value: number = null;

    for (let i = 1; i <= nbCycles; i++) {
        const instruction = instructions[currentInstruction];

        values[i] = x;

        if (instruction === "noop") {
            currentInstruction++;
            continue;
        }

        if (value !== null) {
            x += value;
            value = null;
            currentInstruction++;
        } else {
            value = parseInt(instruction.replace("addx ", ""));
        }
    }

    return values;
};

const strengths: number[] = calculateValues(instructions, 220)
    .map((value: number, i: number) => value * i)
    .filter(
        (value: number, i: number) =>
            [20, 60, 100, 140, 180, 220].indexOf(i) !== -1,
    );

console.log(
    "Total strengths: " +
        strengths.reduce((acc: number, item: number) => acc + item),
);

/**
 * PART 2
 */

const drawScreen = (): string[][] => {
    const screen: string[][] = new Array(6)
        .fill(0)
        .map(() => new Array(40).fill("."));
    const strengths = calculateValues(instructions, 240);
    for (let n = 0; n < strengths.length; n++) {
        const x = n % 40;
        const y = Math.floor(n / 40) % 6;
        const spritePos = strengths[n + 1];
        if (Math.abs(spritePos - x) < 2) {
            screen[y][x] = "#";
        }
    }
    return screen;
};

const screenOutput: string = drawScreen().reduce(
    (acc: string, bit: string[]) =>
        acc + "\n" + bit.reduce((acc: string, bit: string) => acc + bit),
    "",
);

console.log(screenOutput);
