// @ts-ignore
import * as fs from 'fs'

const input: string = fs.readFileSync('input.txt', 'utf8')

/**
 * PART 1
 */

const trees: number[][] = input.split('\n').map((line: string) => line.split('').map((value: string) => parseInt(value)))

const isVisibleFromTop = function (trees: number[][], row: number, col: number): boolean {
    for (let y = col - 1; y >= 0; y--) {
        if (trees[y][row] >= trees[col][row]) {
            return false
        }
    }

    return true
}

const isVisibleFromBottom = function (trees: number[][], row: number, col: number): boolean {
    for (let y = col + 1; y < trees.length; y++) {
        if (trees[y][row] >= trees[col][row]) {
            return false
        }
    }

    return true
}

const isVisibleFromLeft = function (trees: number[][], row: number, col: number): boolean {
    for (let x = row - 1; x >= 0; x--) {
        if (trees[col][x] >= trees[col][row]) {
            return false
        }
    }

    return true
}

const isVisibleFromRight = function (trees: number[][], row: number, col: number): boolean {
    for (let x = row + 1; x < trees.length; x++) {
        if (trees[col][x] >= trees[col][row]) {
            return false
        }
    }

    return true
}


const isVisible = function (trees: number[][], row: number, col: number): boolean {
    return isVisibleFromTop(trees, row, col) ||
        isVisibleFromBottom(trees, row, col) ||
        isVisibleFromRight(trees, row, col) ||
        isVisibleFromLeft(trees, row, col)
}

const visibleTrees = trees.reduce((acc: number, treeLine: number[], row: number) =>
        acc + treeLine.reduce((acc: number, tree: number, col: number) => acc + Number(isVisible(trees, row, col)), 0),
    0)

console.log('Number of visible trees: ' + visibleTrees)

/**
 * PART 2
 */

const topScenicScore = function (trees: number[][], row: number, col: number): number {
    let score = 0
    for (let y = col - 1; y >= 0; y--) {
        score++
        if (trees[y][row] >= trees[col][row]) {
            return score
        }
    }

    return score
}

const bottomScenicScore = function (trees: number[][], row: number, col: number): number {
    let score = 0
    for (let y = col + 1; y < trees.length; y++) {
        score++
        if (trees[y][row] >= trees[col][row]) {
            return score
        }
    }

    return score
}

const leftScenicScore = function (trees: number[][], row: number, col: number): number {
    let score = 0
    for (let x = row - 1; x >= 0; x--) {
        score++
        if (trees[col][x] >= trees[col][row]) {
            return score
        }
    }

    return score
}

const rightScenicScore = function (trees: number[][], row: number, col: number): number {
    let score = 0
    for (let x = row + 1; x < trees.length; x++) {
        score++
        if (trees[col][x] >= trees[col][row]) {
            return score
        }
    }

    return score
}

const calculateScenicScore = function(trees: number[][], row: number, col: number): number {
    return topScenicScore(trees, row, col) *
        bottomScenicScore(trees, row, col) *
        leftScenicScore(trees, row, col) *
        rightScenicScore(trees, row, col)
}

const scenicScores = trees.map((treeLine: number[], row: number) => treeLine.map((tree: number, col: number) => calculateScenicScore(trees, row, col)))

const highestScenicScore = scenicScores.reduce(function (acc: number, scores: number[]) {
        const lineScore = scores.reduce((score: number, acc: number) => (score > acc) ? score : acc, 0)
        return (lineScore > acc) ? lineScore : acc
    }, 0)

console.log('Highest scenic score: ' + highestScenicScore)