import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const result = input
    .match(/mul\(\d+,\d+\)/g) // Extract function calls
    .map((call) => call.replace(/mul\(/g, "").replace(/\)/g, "").split(",")) // Extract arguments
    .map((args) => args.map(Number)) // Convert to numbers
    .reduce((acc, [a, b]) => acc + a * b, 0);

console.log("The result of the multiplication is " + result);

/**
 * PART 2
 */

const splitDoInput = input
    .replace(/(\r\n|\n|\r)/gm, "") // Remove nasty line breaks
    .split("do()")
    .map((s) => s.replace(/don't\(\)(.*)/g, ""))
    .filter((s) => s)
    .map((arg) => arg.match(/mul\(\d+,\d+\)/g)) // Extract function calls
    .flat()
    .map((call) => call.replace(/mul\(/g, "").replace(/\)/g, "").split(",")) // Extract arguments
    .map((args) => args.map(Number)) // Convert to numbers
    .reduce((acc, [a, b]) => acc + a * b, 0);

console.log("The new result of the multiplication is " + splitDoInput);
