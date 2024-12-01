import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
type Monkey = {
    items: number[];
    operator: string;
    operationValue: number;
    divisibility: number;
    successOutcome: number;
    failureOutcome: number;
    nbInspections: number;
};

const monkeyInput = input
    .split("Monkey")
    .map((line: string) => line.split("\n"))
    .map((lines: string[]) =>
        lines
            .slice(1, lines.length)
            .map((line: string) => line.trim())
            .filter(String),
    )
    .filter(String);

const createMonkeyFromInput = function (input: string[]): Monkey {
    const items: number[] = input[0]
        .replace("Starting items: ", "")
        .split(", ")
        .map(Number);
    const operation = input[1].charAt(21);
    const operationValue: number | string = parseInt(
        input[1].replace(/[^0-9]/g, ""),
    );
    const divisibility: number = parseInt(input[2].replace(/[^0-9]/g, ""));
    const successOutcome: number = parseInt(input[3].replace(/[^0-9]/g, ""));
    const failureOutcome: number = parseInt(input[4].replace(/[^0-9]/g, ""));
    return {
        items,
        operator: operation,
        operationValue,
        divisibility,
        successOutcome,
        failureOutcome,
        nbInspections: 0,
    };
};

const calculateWorryLevel = function (item: number, monkey: Monkey): number {
    const operationValue = isNaN(monkey.operationValue)
        ? item
        : monkey.operationValue;
    if (monkey.operator === "+") {
        return item + operationValue;
    }
    return item * operationValue;
};

const doRounds = function (
    monkeys: Array<Monkey>,
    nbRounds: number,
    part: 1 | 2,
): Array<Monkey> {
    // https://en.wikipedia.org/wiki/Chinese_remainder_theorem - had to cheat a bit to get it ;)
    const divisors = monkeys
        .map((monkey: Monkey) =>
            !isNaN(monkey.divisibility) ? monkey.divisibility : 1,
        )
        .reduce((acc: number, value: number) => acc * value, 1);

    for (let i = 0; i < nbRounds; i++) {
        monkeys.map(function (monkey: Monkey): Monkey {
            let newInspections = 0;
            monkey.items = monkey.items.reduce(function (
                acc: number[],
                item: number,
            ): number[] {
                let worryLevel = calculateWorryLevel(item, monkey);
                if (part === 1) {
                    worryLevel = Math.floor(worryLevel / 3);
                } else {
                    worryLevel = worryLevel % divisors;
                }
                if (worryLevel % monkey.divisibility === 0) {
                    monkeys[monkey.successOutcome].items.push(worryLevel);
                } else {
                    monkeys[monkey.failureOutcome].items.push(worryLevel);
                }
                newInspections++;
                return acc;
            }, []);
            monkey.nbInspections += newInspections;
            return monkey;
        });
    }
    return monkeys;
};

const monkeys: Array<Monkey> = monkeyInput.map((lines: string[]) =>
    createMonkeyFromInput(lines),
);
const twentyRoundsMonkeys: Array<Monkey> = doRounds(monkeys, 20, 1);

const monkeyBusiness = twentyRoundsMonkeys
    .map((monkey: Monkey) => monkey.nbInspections)
    .sort((a: number, b: number) => b - a)
    .slice(0, 2)
    .reduce((acc: number, score: number) => score * acc, 1);

console.log("Monkey business: " + monkeyBusiness);

/**
 * PART 2
 */
const bigMonkeys: Array<Monkey> = monkeyInput.map((lines: string[]) =>
    createMonkeyFromInput(lines),
);
const tenThousandRoundsMonkeys: Array<Monkey> = doRounds(bigMonkeys, 10_000, 2);

const bigMonkeyBusiness = tenThousandRoundsMonkeys
    .map((monkey: Monkey) => monkey.nbInspections)
    .sort((a: number, b: number) => b - a)
    .slice(0, 2)
    .reduce((acc: number, score: number) => score * acc, 1);

console.log("Big Monkey business: " + bigMonkeyBusiness);
