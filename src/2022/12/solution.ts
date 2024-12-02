import fs from "node:fs";

const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");

/**
 * PART 1
 */
const parsedInput: number[][] = input
    .split("\n")
    .map((line: string) => line.split(""))
    .map((values: string[]) =>
        values.map(function (value) {
            if (value === "S") {
                return 0;
            }

            if (value === "E") {
                return 27;
            }

            return value.charCodeAt(0) - "a".charCodeAt(0) + 1;
        }),
    );

type Edge = {
    vertexId: number;
    weight: number;
};

type Vertex = {
    id: number;
    name: string;
    edges: Edge[];
    weight: number;
    previousId: number | null;
};

type Graph = {
    vertices: Vertex[];
};

function getEdgesStartToEnd(
    input: number[][],
    y: number,
    x: number,
    id: number,
) {
    let edges: Edge[] = [];
    // Top neighbor
    if (
        input[y - 1] !== undefined &&
        input[y - 1][x] !== undefined &&
        input[y - 1][x] <= input[y][x] + 1
    ) {
        edges.push({ vertexId: id - input[0].length, weight: input[y - 1][x] });
    }
    // Left neighbor
    if (
        input[y] !== undefined &&
        input[y][x - 1] !== undefined &&
        input[y][x - 1] <= input[y][x] + 1
    ) {
        edges.push({ vertexId: id - 1, weight: input[y][x - 1] });
    }
    // Right neighbor
    if (
        input[y] !== undefined &&
        input[y][x + 1] !== undefined &&
        input[y][x + 1] <= input[y][x] + 1
    ) {
        edges.push({ vertexId: id + 1, weight: input[y][x + 1] });
    }
    // Bottom neighbor
    if (
        input[y + 1] !== undefined &&
        input[y + 1][x] !== undefined &&
        input[y + 1][x] <= input[y][x] + 1
    ) {
        edges.push({ vertexId: id + input[0].length, weight: input[y + 1][x] });
    }
    return edges;
}

function getEdgesEndToStart(
    input: number[][],
    y: number,
    x: number,
    id: number,
) {
    let edges: Edge[] = [];
    // Top neighbor
    if (
        input[y - 1] !== undefined &&
        input[y - 1][x] !== undefined &&
        input[y - 1][x] >= input[y][x] - 1
    ) {
        edges.push({ vertexId: id - input[0].length, weight: input[y - 1][x] });
    }
    // Left neighbor
    if (
        input[y] !== undefined &&
        input[y][x - 1] !== undefined &&
        input[y][x - 1] >= input[y][x] - 1
    ) {
        edges.push({ vertexId: id - 1, weight: input[y][x - 1] });
    }
    // Right neighbor
    if (
        input[y] !== undefined &&
        input[y][x + 1] !== undefined &&
        input[y][x + 1] >= input[y][x] - 1
    ) {
        edges.push({ vertexId: id + 1, weight: input[y][x + 1] });
    }
    // Bottom neighbor
    if (
        input[y + 1] !== undefined &&
        input[y + 1][x] !== undefined &&
        input[y + 1][x] >= input[y][x] - 1
    ) {
        edges.push({ vertexId: id + input[0].length, weight: input[y + 1][x] });
    }
    return edges;
}

const createGraph = function (input: number[][], part: 1 | 2): Graph {
    const graph: Graph = { vertices: [] };
    let id = 1;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[0].length; x++) {
            const name =
                input[y][x] === 0
                    ? "S"
                    : input[y][x] === 27
                      ? "E"
                      : String.fromCharCode(input[y][x] + 96);
            const edges =
                part === 1
                    ? getEdgesStartToEnd(input, y, x, id)
                    : getEdgesEndToStart(input, y, x, id);
            graph.vertices.push({
                id,
                edges,
                name,
                weight: Infinity,
                previousId: null,
            });
            id++;
        }
    }
    return graph;
};

const calculateWeights = function (
    graph: Graph,
    startVertex: Vertex,
    endVertex: Vertex | null,
): Graph {
    graph.vertices = graph.vertices.map(function (vertex: Vertex) {
        if (vertex.id === startVertex.id) {
            vertex.weight = 0;
        }
        return vertex;
    });
    let unvisitedVertices: Vertex[] = graph.vertices;

    while (unvisitedVertices.length > 0) {
        const unvisitedVerticesSortedByWeight = unvisitedVertices.sort(
            (a: Vertex, b: Vertex) => a.weight - b.weight,
        );
        const currentVertex: Vertex = graph.vertices.find(
            (vertex: Vertex) =>
                vertex.id === unvisitedVerticesSortedByWeight[0].id,
        );

        if (endVertex !== null && currentVertex.id === endVertex.id) {
            break;
        }

        for (let edge of currentVertex.edges) {
            // Only visit unvisited neighbors
            if (
                unvisitedVertices.findIndex(
                    (vertex: Vertex) => vertex.id === edge.vertexId,
                ) === -1
            ) {
                continue;
            }
            const weight: number = currentVertex.weight + edge.weight;
            const vertexIndex = graph.vertices.findIndex(
                (vertex: Vertex) => vertex.id === edge.vertexId,
            );
            if (weight < graph.vertices[vertexIndex].weight) {
                graph.vertices[vertexIndex].weight = weight;
                graph.vertices[vertexIndex].previousId = currentVertex.id;
            }
        }

        unvisitedVertices = unvisitedVertices.filter(
            (vertex: Vertex) => vertex.id !== currentVertex.id,
        );
    }

    return graph;
};

const findShortestPath = function (
    graph: Graph,
    startVertex: Vertex,
    endVertex: Vertex,
): Vertex[] {
    let path: Vertex[] = [];

    let currentVertex = endVertex;
    while (
        currentVertex.previousId !== null &&
        currentVertex.id !== startVertex.id
    ) {
        path.push(currentVertex);
        currentVertex = graph.vertices.find(
            (vertex: Vertex) => vertex.id === currentVertex.previousId,
        );
    }

    return path.reverse();
};

const graph: Graph = createGraph(parsedInput, 1);

const startVertex: Vertex = graph.vertices.find(
    (vertex: Vertex) => vertex.name === "S",
);
const endVertex: Vertex = graph.vertices.find(
    (vertex: Vertex) => vertex.name === "E",
);
const graphWeights = calculateWeights(graph, startVertex, endVertex);
const shortestPath: Vertex[] = findShortestPath(
    graphWeights,
    startVertex,
    endVertex,
);

console.log("Shortest path: " + shortestPath.length);

/**
 * PART 2
 * To calculate the weights once, start from the end to the beginning
 */

const graph2: Graph = createGraph(parsedInput, 2);

const startVertex2: Vertex = graph2.vertices.find(
    (vertex: Vertex) => vertex.name === "E",
);

const graphWeights2 = calculateWeights(graph2, startVertex2, null);

const startVertexWeight2: Vertex = graphWeights2.vertices.find(
    (vertex: Vertex) => vertex.name === "E",
);
const endVertices = graphWeights2.vertices
    .filter((vertex: Vertex) => vertex.name === "a" || vertex.name === "S")
    .filter((vertex: Vertex) => vertex.weight !== Infinity);
const shortestPath2 = endVertices
    .map(
        (startVertex: Vertex) =>
            findShortestPath(graphWeights2, startVertexWeight2, startVertex)
                .length,
    )
    .sort((a: number, b: number) => a - b)
    .shift();

console.log("Shortest path 2: " + shortestPath2);
