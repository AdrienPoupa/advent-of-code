import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const commands = input
    .split("\n\$ ")
    .map((command: string) => command.split("\n"));
commands[0][0] = "cd /"; // Manual fix for bad regex

interface Folder {
    id: number;
    name?: string;
    parentId: number;
    filesSize: number;
    totalSize: number;
}

const findChildren = function (hierarchy: Folder[], folder: Folder) {
    return hierarchy.reduce((r: any, currentFolder: Folder) => {
        if (currentFolder.parentId === folder.id) {
            r.push(currentFolder, ...findChildren(hierarchy, currentFolder));
        }
        return r;
    }, []);
};

const calculateTotalSize = function (
    hierarchy: Folder[],
    folder: Folder,
): number {
    let totalSize = folder.filesSize;
    const children = findChildren(hierarchy, folder);
    const filesSize = children.reduce(
        (totalSize: number, currentFolder: Folder) =>
            totalSize + currentFolder.filesSize,
        0,
    );
    return totalSize + filesSize;
};

const buildHierarchy = function (commands: string[][]) {
    let currentDirectory: Folder = {
        id: 0,
        parentId: 0,
        filesSize: 0,
        totalSize: 0,
    };
    let currentDirectoryName = "";
    let newDirectory: Folder = {
        id: 0,
        parentId: 0,
        filesSize: 0,
        totalSize: 0,
    };
    let hierarchy: any = [];
    let id = 1;

    commands.forEach(function (command) {
        let input = command[0];
        if (input.indexOf("cd") !== -1) {
            currentDirectoryName = input.substring(3);
            if (currentDirectoryName === "..") {
                currentDirectory = hierarchy.find(
                    (folder: any) => folder.id === currentDirectory.parentId,
                );
            } else {
                newDirectory = {
                    id,
                    name: currentDirectoryName,
                    parentId: currentDirectory.id,
                    filesSize: 0,
                    totalSize: 0,
                };
                currentDirectory = newDirectory;
                hierarchy.push(newDirectory);
                id += 1;
            }
        }
        if (input.indexOf("ls") !== -1) {
            // Filter out folders
            let output = command
                .slice(1)
                .filter((entry: string) => entry.indexOf("dir") === -1);
            // Calculate files size
            currentDirectory.filesSize = output
                .map((folder: string) => parseInt(folder.match(/\d+/)![0]))
                .reduce(
                    (totalSize: number, size: number) => totalSize + size,
                    0,
                );
        }
    });

    // Calculate total sizes
    hierarchy.map(
        (folder: Folder) =>
            (folder.totalSize = calculateTotalSize(hierarchy, folder)),
    );

    return hierarchy;
};

const hierarchy = buildHierarchy(commands);

const totalSize = hierarchy
    .filter((folder: Folder) => folder.totalSize <= 100000)
    .reduce(
        (totalSize: number, folder: Folder) => totalSize + folder.totalSize,
        0,
    );

console.log("Sum of directories: " + totalSize);

/**
 * PART 2
 */
const hierarchySortedBySize = hierarchy.sort(
    (folder: Folder, otherFolder: Folder) =>
        folder.totalSize < otherFolder.totalSize ? 1 : -1,
);
const unusedSpace = 70000000 - hierarchySortedBySize[0].totalSize;

const eligibleDirectories = hierarchySortedBySize.filter(
    (folder: Folder) => unusedSpace + folder.totalSize >= 30000000,
);

const totalSizeToRemove =
    eligibleDirectories[eligibleDirectories.length - 1].totalSize;

console.log("Folder size to remove: " + totalSizeToRemove);
