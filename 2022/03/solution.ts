// @ts-ignore
import * as fs from 'fs';

const input: string = fs.readFileSync('input.txt', 'utf8')

const sumArray = function (array: number[]): number {
    return array.reduce((partialSum: number, value: number) => partialSum + value, 0)
}

/**
 * PART 1
 */

const rucksacks = input.split('\n').filter((i: string) => i);

// Split each rucksack in two equal compartments
const compartments = rucksacks.map(
    (content: string) => [content.slice(0, content.length / 2), content.slice(content.length / 2, content.length)]
)

// Deduplicate each compartment by using Sets
const uniqueCompartments = compartments.map(
    (content: string[]) => [new Set(content[0].split('')), new Set(content[1].split(''))]
)

// Find the intersection of the 2 sets
const sharedItems = uniqueCompartments.map(
    (content: Set<string>[]) => [...content[0]].filter(x => content[1].has(x))
)
    .flat() // Flatten the resulting array

// Convert each letter to its value
// a = 97, so we need to subtract 96 to map it to 1
// A = 65, so we need to subtract 38 to map it to 27
const getLetterValues = function(sharedItems: string[]): number[] {
    return sharedItems.map(
        (item: string) => item.toLowerCase() === item ? (item.charCodeAt(0) - 96) : (item.charCodeAt(0) - 38)
    )
}

console.log('Sum of the priorities: ' + sumArray(getLetterValues(sharedItems)))

/**
 * PART 2
 */

// Create groups of 3 rucksacks
let groupedRucksacks: string[][] = [];

for (let i = 0; i < rucksacks.length; i = i + 3) {
    groupedRucksacks.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]])
}

const uniqueGroupCompartments = groupedRucksacks.map(
    (content: string[]) => [
        new Set(content[0].split('')),
        new Set(content[1].split('')),
        new Set(content[2].split(''))
    ]
)

const sharedGroupItems = uniqueGroupCompartments.map(
    (content: Set<string>[]) => [...content[0]].filter(x => content[1].has(x) && content[2].has(x))
)
    .flat()

console.log('Sum of the priority groups: ' + sumArray(getLetterValues(sharedGroupItems)))
