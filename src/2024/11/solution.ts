import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const parsedInput = input.split(" ").map(Number);

const blink = (stones: number[]): number[] => {
    const newStones = [];
    for (let i = 0; i < stones.length; i++) {
        // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
        if (stones[i] === 0) {
            newStones.push(1);
        } else if (String(stones[i]).length % 2 === 0) {
            // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
            // The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
            const stoneString = String(stones[i]);
            const half = Math.floor(stoneString.length / 2);
            const leftStone = Number(stoneString.slice(0, half));
            const rightStone = Number(stoneString.slice(half));
            newStones.push(leftStone, rightStone);
        } else {
            // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024
            newStones.push(stones[i] * 2024);
        }
    }
    return newStones;
};

const finalBlink = 25;
let stones = parsedInput;
for (let i = 0; i < finalBlink; i++) {
    stones = blink(stones);
}
console.log("Number of stones: " + stones.length);

/**
 * PART 2
 */
const allStones = Object.fromEntries(parsedInput.map((x) => [x, 1]));
for (let i = 0; i < 75; i++) {
    const newStones = {};
    for (const [stone, count] of Object.entries(allStones)) {
        const stoneString = stone.toString();
        if (stone == "0") {
            newStones[1] = newStones[1] ? newStones[1] + count : count;
        } else if (stoneString.length % 2 == 0) {
            const half = Math.floor(stoneString.length / 2);
            const leftStone = Number(stoneString.slice(0, half));
            const rightStone = Number(stoneString.slice(half));
            newStones[leftStone] = newStones[leftStone]
                ? newStones[leftStone] + count
                : count;
            newStones[rightStone] = newStones[rightStone]
                ? newStones[rightStone] + count
                : count;
        } else {
            const multiplied = Number(stone) * 2024;
            newStones[multiplied] = newStones[multiplied]
                ? newStones[multiplied] + count
                : count;
        }
    }
    for (const key in allStones) {
        delete allStones[key];
    }
    Object.assign(allStones, newStones);
}

console.log(
    "Number of stones after 75 blinks: " +
        Object.values(allStones).reduce((a, b) => a + b, 0),
);
