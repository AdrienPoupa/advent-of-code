// @ts-ignore
import * as fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

/**
 * PART 1
 */

const enum Shape {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

const enum Outcome {
    Won = 6,
    Lost = 0,
    Draw = 3,
}

const determineOutcome = function(opponentShape: Shape, ownShape: Shape): Outcome {
    if (opponentShape === ownShape) {
        return Outcome.Draw
    }

    if (
        opponentShape === Shape.Rock && ownShape === Shape.Scissors ||
        opponentShape === Shape.Scissors && ownShape === Shape.Paper ||
        opponentShape === Shape.Paper && ownShape === Shape.Rock
    ) {
        return Outcome.Lost
    }

    return Outcome.Won
}

const calculateScore = function(opponentShape: Shape, ownShape: Shape): number {
    return determineOutcome(opponentShape, ownShape) + ownShape
}

const movesMapping: Record<string, number> = {
    'A': Shape.Rock,
    'B': Shape.Paper,
    'C': Shape.Scissors,
    'X': Shape.Rock,
    'Y': Shape.Paper,
    'Z': Shape.Scissors,
}

const rounds = input.split('\n').filter(i => i).map(i => i.split(' '))

// Substitute supplied strings with our enums for both opponent and own moves (eg A = X = Rock = 1)
const substitutedRounds = rounds.map(
    round => round.map((shape: string) => movesMapping[shape])
)

// Calculate scores
const scores = substitutedRounds.map(
    round => calculateScore(round[0] as Shape, round[1] as Shape)
)

// Sum scores
const totalScore = scores.reduce((partialSum: number, score: number) => partialSum + score, 0)

console.log('Total score: ' + totalScore);

/**
 * PART 2
 */
const desiredOutcomes: Record<string, number> = {
    'X': Outcome.Lost,
    'Y': Outcome.Draw,
    'Z': Outcome.Won,
}

const determineMove = function(opponentShape: Shape, desiredOutcome: Outcome): Shape {
    if (desiredOutcome === Outcome.Draw) {
        return opponentShape
    }

    const rockOutcome = determineOutcome(opponentShape, Shape.Rock)
    if (rockOutcome === desiredOutcome) {
        return Shape.Rock
    }

    const paperOutcome = determineOutcome(opponentShape, Shape.Paper)
    if (paperOutcome === desiredOutcome) {
        return Shape.Paper
    }

    return Shape.Scissors
}

const substitutedDeterminedRounds = rounds.map(
    round => round.map(
        (shape: string, index: number) => index === 0 ? movesMapping[shape] : determineMove(movesMapping[round[0]], desiredOutcomes[shape])
    )
)

// Calculate scores
const newMethodScores = substitutedDeterminedRounds.map(
    round => calculateScore(round[0] as Shape, round[1] as Shape)
)

// Sum scores
const newMethodTotalScore = newMethodScores.reduce((partialSum: number, score: number) => partialSum + score, 0)

console.log('Method 2 score: ' + newMethodTotalScore);
