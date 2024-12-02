import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const parsedInput = input
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => line.map((item) => Number(item)));

const isReportSafe = (report: number[]): boolean => {
    const isIncreasing = report.every((item, index, array) => {
        if (index === 0) return true;
        return item >= array[index - 1];
    });
    const isDecreasing = report.every((item, index, array) => {
        if (index === 0) return true;
        return item <= array[index - 1];
    });
    if (!isIncreasing && !isDecreasing) {
        return false;
    }
    return report.every((item, index, array) => {
        if (index === 0) return true;
        const difference = Math.abs(item - array[index - 1]);
        return difference >= 1 && difference <= 3;
    });
};

const safeReports = parsedInput.map(isReportSafe).filter(Boolean).length;

console.log("Number of safe reports: " + safeReports);

/**
 * PART 2
 */
const isReportSafeWithDampener = (report: number[]): boolean => {
    if (isReportSafe(report)) {
        return true;
    }
    for (let i = 0; i < report.length; i++) {
        const reportCopy = [...report];
        reportCopy.splice(i, 1);
        if (isReportSafe(reportCopy)) {
            return true;
        }
    }
    return false;
};

const safeReportsWithDampener = parsedInput
    .map(isReportSafeWithDampener)
    .filter(Boolean).length;

console.log(
    "Number of safe reports with the Problem Dampener: " +
        safeReportsWithDampener,
);
