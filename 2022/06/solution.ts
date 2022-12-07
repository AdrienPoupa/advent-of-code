// @ts-ignore
import * as fs from 'fs'

const input: string = fs.readFileSync('input.txt', 'utf8')

// Characters in a given string are different if when supplied to a set, the set's size matches the original string size
const areCharactersDifferent = function(characters: string): boolean {
    const characterSet = new Set<string>(characters)
    return characterSet.size === characters.length;
}

// Find the position of the first maker
const findFirstMarker = function(input: string, windowLength: number): number {
    let startPosition  = 0;
    let characters = ''

    do {
        characters = input.substring(startPosition, startPosition + windowLength)
        startPosition += 1
    } while (characters.length === windowLength && !areCharactersDifferent(characters))

    // In case there are no markers
    if (characters.length !== windowLength) {
        return -1
    }

    return startPosition + windowLength - 1
}

console.log('Start of packet marker position: ' + findFirstMarker(input, 4))
console.log('Start of message marker position: ' + findFirstMarker(input, 14))
