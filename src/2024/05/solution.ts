import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const splitInput = input.split("\n\n");

const rules = splitInput[0]
    .split("\n")
    .map((rule) => rule.split("|").map((number) => Number(number)));

const updates = splitInput[1]
    .split("\n")
    .map((update) => update.split(",").map((number) => Number(number)));

const isRightOrder = (update: number[], rules: number[][]): boolean => {
    for (let i = 0; i < update.length; i++) {
        const number = update[i];

        const beforeRules = rules.filter((rule) => rule[0] === number);
        const afterRules = rules.filter((rule) => rule[1] === number);

        const beforeArray = update.slice(0, i);
        const afterArray = update.slice(i + 1);

        for (let j = 0; j < afterArray.length; j++) {
            if (!beforeRules.some((rule) => rule[1] === afterArray[j])) {
                return false;
            }
        }

        for (let j = 0; j < beforeArray.length; j++) {
            if (!afterRules.some((rule) => rule[0] === beforeArray[j])) {
                return false;
            }
        }
    }
    return true;
};

const correctUpdates = updates.filter((update) => isRightOrder(update, rules));

const middleNumbers = correctUpdates.reduce(
    (acc, update) => acc + update[Math.floor(update.length / 2)],
    0,
);

console.log("Middle page numbers: " + middleNumbers);

/**
 * PART 2
 */
const fixUpdate = (incorrectUpdate: number[], rules: number[][]): number[] => {
    const fixedUpdate = [...incorrectUpdate];

    do {
        for (let i = 0; i < fixedUpdate.length; i++) {
            const number = fixedUpdate[i];

            const beforeRules = rules.filter((rule) => rule[0] === number);

            const afterArray = fixedUpdate.slice(i + 1);

            for (let j = 0; j < afterArray.length; j++) {
                const beforeRulesNumber = beforeRules.map((rule) => rule[1]);
                const difference = afterArray.filter(
                    (x) => !beforeRulesNumber.includes(x),
                );

                if (difference.length > 0) {
                    const index = fixedUpdate.indexOf(difference[0]);
                    fixedUpdate.splice(i, 0, ...fixedUpdate.splice(index, 1));
                    break;
                }
            }
        }
    } while (!isRightOrder(fixedUpdate, rules));

    return fixedUpdate;
};

const incorrectUpdates = updates.filter(
    (update) => !isRightOrder(update, rules),
);

const fixedUpdates = incorrectUpdates.map((update) => fixUpdate(update, rules));

const fixedMiddleNumbers = fixedUpdates.reduce(
    (acc, update) => acc + update[Math.floor(update.length / 2)],
    0,
);

console.log("Fixed middle page numbers: " + fixedMiddleNumbers);
