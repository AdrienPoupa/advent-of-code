import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

class Stack<T> {
    private content: T[] = [];

    push(item: T): void {
        this.content.push(item);
    }

    pop(): T | undefined {
        return this.content.pop();
    }

    peek(): T | undefined {
        return this.content[this.content.length - 1];
    }
}

/**
 * PART 1
 */

const parsedInput: string[] = input.split("\n");

// Find the number of stacks
const stacksLine: string =
    parsedInput.find((value: string) => value.indexOf(" 1") !== -1) ?? "";
const parsedNumbers: string[] = stacksLine.match(/\d+/g) ?? [""];

const nbStacks: number = parseInt(parsedNumbers[parsedNumbers.length - 1]);

const createEmptyStacks = function (nbStacks: number): Stack<string>[] {
    const stacks: Stack<string>[] = new Array(nbStacks);
    for (let i: number = 0; i < nbStacks; i++) {
        stacks[i] = new Stack<string>();
    }
    return stacks;
};

const fillStackContent = function (
    content: string,
    stacks: Stack<string>[],
): void {
    let currentStack = 0;
    for (let i: number = 1; i <= nbStacks * 4; i = i + 4) {
        if (content[i] !== undefined && content[i] !== " ") {
            stacks[currentStack].push(content[i]);
        }
        currentStack++;
    }
};

const fillStacks = function (): Stack<string>[] {
    const stacks = createEmptyStacks(nbStacks);

    // Get stack contents from string, reversing the order to start filling the bottom
    const stacksContent: string[] = parsedInput
        .filter((value: string) => value.indexOf("[") !== -1)
        .reverse();

    stacksContent.map((content: string) => fillStackContent(content, stacks));

    return stacks;
};

const moveStacks = function (
    stacks: Stack<string>[],
    nbMoves: number,
    fromStackNb: number,
    toStackNb: number,
): void {
    for (let i: number = 0; i < nbMoves; i++) {
        let removedItem = stacks[fromStackNb - 1].pop();
        if (removedItem !== undefined) {
            stacks[toStackNb - 1].push(removedItem);
        }
    }
};

const stacks = fillStacks();

// Parse moves: "move 1 from 2 to 1' becomes [1,2,1]
const moves: number[][] = parsedInput
    .filter((value: string) => value.indexOf("move") !== -1)
    .map((move: string) =>
        move.match(/\d+/g)!.map((move: string) => parseInt(move)),
    );

moves.map((move: number[]) => moveStacks(stacks, move[0], move[1], move[2]));

const peekStacks = function (stacks: Stack<string>[]): string {
    return stacks.reduce(
        (acc: string, value: Stack<string>) => acc + (value.peek() || ""),
        "",
    );
};

console.log("Top of each stack with CraneMover 9000: " + peekStacks(stacks));

/**
 * PART 2
 */

const moveMultipleStacks = function (
    stacks: Stack<string>[],
    nbMoves: number,
    fromStackNb: number,
    toStackNb: number,
): void {
    let removedItems: string[] = [];
    for (let i: number = 0; i < nbMoves; i++) {
        let removedItem = stacks[fromStackNb - 1].pop();
        if (removedItem !== undefined) {
            removedItems.unshift(removedItem);
        }
    }
    removedItems.map((item: string) => stacks[toStackNb - 1].push(item));
};

const newStacks = fillStacks();

moves.map((move: number[]) =>
    moveMultipleStacks(newStacks, move[0], move[1], move[2]),
);

console.log("Top of each stack with CraneMover 9001: " + peekStacks(newStacks));
