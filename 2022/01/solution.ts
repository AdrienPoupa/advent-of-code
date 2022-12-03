// @ts-ignore
import * as fs from 'fs';

const input: string = fs.readFileSync('input.txt', 'utf8')

const sumArray = function (array: number[]) {
    return array.reduce((partialSum: number, value: number) => partialSum + value, 0)
}

/**
 * PART 1
 */

// Create an array of calories for each elf
const individualCalories = input.split('\n\n').map(
    individualCaloriesString => individualCaloriesString.split('\n').map(Number)
)

// Sum all the subarrays
const individualSums = individualCalories.reduce((acc, val: number[]) => {
    acc.push(val.reduce((partialSum: number, calories: number) => partialSum + calories, 0));
    return acc;
}, [])

const maximum = Math.max(...individualSums);

console.log('Maximum calories: ' + maximum)

/**
 * PART 2
 */

const sortedSums = individualSums.sort((elf: number, otherElf: number) => otherElf - elf)

console.log('Top 3 Sum: ' + sumArray(sortedSums.slice(0, 3)))
