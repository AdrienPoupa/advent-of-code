import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

const sumArray = function (array: number[]): number {
    return array.reduce(
        (partialSum: number, value: number) => partialSum + value,
        0,
    );
};

/**
 * PART 1
 */
const rucksacks = input.split("\n").filter((i: string) => i);

// Split each rucksack in two equal compartments, then deduplicate each compartment by using Sets
const uniqueCompartments = rucksacks.map((content: string) => [
    new Set(content.slice(0, content.length / 2).split("")),
    new Set(content.slice(content.length / 2, content.length).split("")),
]);

// Find the intersection of the 2 sets
const sharedItems = uniqueCompartments
    .map((content: Set<string>[]) =>
        [...content[0]].filter((x) => content[1].has(x)),
    )
    .flat();

// a = 97, so we need to subtract 96 to map it to 1
// A = 65, so we need to subtract 38 to map it to 27
const getLetterValue = function (letter: string): number {
    return letter.toLowerCase() === letter
        ? letter.charCodeAt(0) - 96
        : letter.charCodeAt(0) - 38;
};

console.log(
    "Sum of the priorities: " +
        sumArray(sharedItems.map((item: string) => getLetterValue(item))),
);

/**
 * PART 2
 */
// Create groups of 3 rucksacks
let uniqueGroupCompartments: Set<string>[][] = [];

for (let i = 0; i < rucksacks.length; i = i + 3) {
    uniqueGroupCompartments.push([
        new Set(rucksacks[i].split("")),
        new Set(rucksacks[i + 1].split("")),
        new Set(rucksacks[i + 2].split("")),
    ]);
}

const sharedGroupItems = uniqueGroupCompartments
    .map((content: Set<string>[]) =>
        [...content[0]].filter((x) => content[1].has(x) && content[2].has(x)),
    )
    .flat();

console.log(
    "Sum of the priority groups: " +
        sumArray(sharedGroupItems.map((item: string) => getLetterValue(item))),
);
