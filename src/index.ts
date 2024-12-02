import { execSync } from "node:child_process";
import fs from "node:fs";

const path = process.argv[2];

const folderPath = __dirname + `/${path}`;
const filePath = folderPath + `/solution.ts`;

const runSolution = (path: string) => {
    const dayPath = path.replace(`${__dirname}/`, "");
    console.log(`# Running solution for day ${dayPath}`);
    execSync(`yarn ts-node ${path}/solution.ts`, {
        stdio: "inherit",
    });
    console.log("\n");
};

const runFolder = (folderPath: fs.PathLike) => {
    const dir = fs.opendirSync(folderPath);
    let dirent: fs.Dirent;
    while ((dirent = dir.readSync()) !== null) {
        runSolution(`${folderPath}/${dirent.name}`);
    }
    dir.closeSync();
};

// Run a single day
if (fs.existsSync(filePath)) {
    runSolution(folderPath);
    process.exit(0);
}

// Run a whole year
if (fs.existsSync(folderPath)) {
    runFolder(folderPath);
    process.exit(0);
}

// Run all years
const years = ["2022", "2024"];

years.forEach((year) => {
    console.log(`# Running solutions for year ${year}\n`);
    runFolder(__dirname + `/${year}`);
});
