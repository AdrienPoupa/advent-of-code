import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
// 12345 => 0..111....22222 => 022111222......
// 1: 1 block file with ID 0
// 2: 2 blocks of free space
// 3: 3 block file with ID 1
// 4: 4 blocks of free space
// 5: 5 block file with ID 2

const parsedInput = input.split("").map(Number);

const FREE_SPACE = ".";

type DiskMap = Array<number | ".">;

const convertDiskMap = (input: number[]): DiskMap => {
    const diskMap: DiskMap = [];

    let id = 0;
    for (let i = 0; i < input.length; i++) {
        const symbol = i % 2 === 0 ? id : FREE_SPACE;
        diskMap.push(...Array(input[i]).fill(symbol));
        if (symbol !== FREE_SPACE) {
            id++;
        }
    }

    return diskMap;
};

const diskMapToString = (diskMap: DiskMap | DiskMapBlock): string =>
    diskMap.map((block) => block).join("");

const optimizeDiskMap = (diskMap: DiskMap): DiskMap => {
    const totalBlocks = diskMap.filter((block) => block !== FREE_SPACE).length;
    let blocksOptimized = 0;

    for (let i = 0; i < diskMap.length && blocksOptimized < totalBlocks; i++) {
        if (diskMap[i] !== FREE_SPACE) {
            blocksOptimized++;
            continue;
        }

        for (let j = diskMap.length - 1; j >= 0; j--) {
            if (diskMap[j] !== FREE_SPACE) {
                diskMap[i] = diskMap[j];
                diskMap[j] = FREE_SPACE;
                blocksOptimized++;
                break;
            }
        }
    }

    return diskMap;
};

const calculateChecksum = (diskMap: DiskMap): number => {
    let acc = 0;
    for (let i = 0; i < diskMap.length; i++) {
        if (diskMap[i] === FREE_SPACE) {
            continue;
        }

        const blockNumber = diskMap[i] as number;

        acc += i * blockNumber;
    }
    return acc;
};

const diskMap = convertDiskMap(parsedInput);
const optimizedDiskMap = optimizeDiskMap(diskMap);
console.log("Filesystem checksum: " + calculateChecksum(optimizedDiskMap));

/**
 * PART 2
 */

type DiskMapBlock = Array<number[] | "."[]>;

const convertDiskMapBlocks = (input: number[]): DiskMapBlock => {
    const diskMap: DiskMapBlock = [];

    let id = 0;
    for (let i = 0; i < input.length; i++) {
        const symbol = i % 2 === 0 ? id : FREE_SPACE;
        if (input[i] === 0) {
            continue;
        }
        diskMap.push([...Array(input[i]).fill(symbol)]);
        if (symbol !== FREE_SPACE) {
            id++;
        }
    }

    return diskMap;
};

const optimizeDiskMapBlocks = (diskMap: DiskMapBlock): DiskMapBlock => {
    for (let i = diskMap.length - 1; i >= 0; i--) {
        if (diskMap[i][0] === FREE_SPACE) {
            continue;
        }

        for (let j = 0; j < diskMap.length; j++) {
            if (
                diskMap[j][0] === FREE_SPACE &&
                diskMap[j].length >= diskMap[i].length &&
                j < i
            ) {
                const diff = Math.abs(diskMap[i].length - diskMap[j].length);
                diskMap[j] = diskMap[i];
                let index = i;
                if (diff > 0) {
                    const newFreeSpace = [...Array(diff).fill(FREE_SPACE)];
                    diskMap.splice(j + 1, 0, newFreeSpace);
                    index = i + 1;
                }

                diskMap[index] = [
                    ...Array(diskMap[index].length).fill(FREE_SPACE),
                ];

                for (let k = 0; k < diskMap.length; k++) {
                    if (
                        diskMap[k][0] === FREE_SPACE &&
                        diskMap[k + 1] &&
                        diskMap[k + 1][0] === FREE_SPACE
                    ) {
                        diskMap[k] = [
                            ...diskMap[k],
                            ...diskMap[k + 1],
                        ] as "."[];
                        diskMap.splice(k + 1, 1);
                    }
                    if (
                        diskMap[k][0] === FREE_SPACE &&
                        diskMap[k - 1] &&
                        diskMap[k - 1][0] === FREE_SPACE
                    ) {
                        diskMap[k] = [
                            ...diskMap[k],
                            ...diskMap[k - 1],
                        ] as "."[];
                        diskMap.splice(k - 1, 1);
                    }
                }
                break;
            }
        }
    }

    return diskMap.filter((block) => block);
};

const diskMapBlock = convertDiskMapBlocks(parsedInput);
const optimizedDiskMapBlock = optimizeDiskMapBlocks(diskMapBlock);
console.log(
    "Block filesystem checksum: " +
        calculateChecksum(optimizedDiskMapBlock.flat()),
);
