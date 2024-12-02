import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const parsedInput = input.split("\n").map((line) => line.split(" "));

const leftList = parsedInput
    .map((line) => Number(line[0]))
    .sort((a, b) => a - b);

const rightList = parsedInput
    .map((line) => Number(line[line.length - 1]))
    .sort((a, b) => a - b);

const distances = leftList.map((left, index) =>
    Math.abs(left - rightList[index]),
);

const totalDistance = distances.reduce((acc, val) => acc + val, 0);

console.log("The total distance is " + totalDistance);

/**
 * PART 2
 */
const uniqueLeftList = Array.from(new Set(leftList));

const numberOfOccurrencesMap = uniqueLeftList.reduce(
    (acc, number) =>
        acc.set(number, rightList.filter((right) => right === number).length),
    new Map<number, number>(),
);

const similarityScore = leftList.reduce(
    (acc, val) => acc + val * numberOfOccurrencesMap.get(val),
    0,
);

console.log("The similarity score is " + similarityScore);
