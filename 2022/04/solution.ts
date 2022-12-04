// @ts-ignore
import * as fs from 'fs';

const input: string = fs.readFileSync('input.txt', 'utf8')

/**
 * PART 1
 */

const pairs: string[][] = input.split('\n')
    .map((pair: string) => pair.split(','))

// Convert '2-4' to [2, 3, 4]
const expandAssignments = function (assignment: string): number[] {
    const numbers: string[] = assignment.split('-')
    const start = parseInt(numbers[0]);
    const end = parseInt(numbers[1]);
    let assignments = [];
    for (let i = start; i < end + 1; i++) {
        assignments.push(i)
    }
    return assignments
}

// Create an array of expanded pairs, eg: 2-4,6-8 =>  [[2,3,4],[6,7,8]],
const expandedPairs: number[][][] = pairs.map((pairs: string[]) => pairs.map((pair: string) => expandAssignments(pair)))

// 2 pairs are fully overlapping if one is fully contained in the other
const arePairsFullyOverlapping = function (pair: number[], otherPair: number[]): boolean {
    return pair.every(v => otherPair.includes(v)) || otherPair.every(v => pair.includes(v));
}

// Count fully overlapping pairs
const fullyOverlappingPairs: number = expandedPairs.reduce(
    (acc: number, pairs: number[][]) => arePairsFullyOverlapping(pairs[0], pairs[1]) ? acc+1 : acc, 0
)

console.log('Number of fully overlapping pairs: ' + fullyOverlappingPairs)

/**
 * PART 2
 */

// 2 pairs are overlapping when at least one element is included in both
const arePairsOverlapping = function (pair: number[], otherPair: number[]): boolean {
    return pair.reduce((acc: boolean, current: number) => (acc === false) ? otherPair.indexOf(current) !== -1 : true, false) ||
        otherPair.reduce((acc: boolean, current: number) => (acc === false) ? pair.indexOf(current) !== -1 : true, false)
}

// Count overlapping pairs
const overlappingPairs: number = expandedPairs.reduce(
    (acc: number, pairs: number[][]) => arePairsOverlapping(pairs[0], pairs[1]) ? acc+1 : acc, 0
)

console.log('Number of overlapping pairs: ' + overlappingPairs)