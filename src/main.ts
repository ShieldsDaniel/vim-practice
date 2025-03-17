import './style.scss'

type Char = string;
type Buffer = Char[][];

const blockHeight = 19;
const fontSize = 16;
const blockWidth = 9.64;
const bufferHeight = Math.floor(window.innerHeight / blockHeight);
const bufferWidth = Math.floor(window.innerWidth / blockWidth);
// const topStartIndex = 0;
// const leftStartIndex = 0;

export const createBlock = (document: Document, column: number): HTMLDivElement => {
    const displayBlock = document.createElement("div");

    displayBlock.style.minWidth = `${blockWidth}px`;
    displayBlock.style.minHeight = `${blockHeight}px`;
    displayBlock.style.display = "flex";
    displayBlock.style.justifyContent = "center";
    displayBlock.style.alignItems = "center";
    displayBlock.style.textAlign = "center";
    displayBlock.style.fontSize = `${fontSize}px`;
    displayBlock.dataset.column = column.toString();

    const textNode = document.createTextNode("");
    displayBlock.appendChild(textNode);
    return displayBlock;
};

export const createLine = (document: Document, bufferWidth: number, row: number): HTMLDivElement => {
    const displayLine = document.createElement("div");

    displayLine.style.height = `${blockHeight}px`;
    displayLine.style.display = "flex";
    displayLine.dataset.row = row.toString();

    for (let i = 0; i < bufferWidth; i++) {
        if (i > 1_000_000) {
            break
        }
        displayLine.appendChild(createBlock(document, i));
    }
    return displayLine;
};

export const createBuffer = (document: Document, bufferWidth: number, bufferHeight: number): HTMLDivElement => {
    console.log(bufferHeight);
    console.log(bufferWidth);
    const displayBuffer = document.createElement("div");

    for (let i = 0; i < bufferHeight; i++) {
        if (i > 1_000_000) {
            break
        }
        displayBuffer.appendChild(createLine(document, bufferWidth, i));
    }
    return displayBuffer;
};

export const renderBuffer = (buffer: HTMLDivElement, bufferData: Buffer): void => {
    for (let i = 0; i < bufferHeight; i++) {
        for (let j = 0; j < bufferWidth; j++) {
            const block = buffer.querySelector<HTMLDivElement>(`div[data-row="${i}"] div[data-column="${j}"]`);
            if (block) {
                block.innerText = bufferData[i][j] ?? '';
            }
        }
    }
}

// TODO: we need to be able to create this programmatically
const bufferData: Buffer = [
    [],
    ["\"", "H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d", "\""],
    [],
    ["H", "e", "l", "l", "o"],
    [],
    [],
    [],
    ["f", "u", "n", "c", "t", "i", "o", "n", " ", "y", "(", ")", " ", "{"],
    [" ", " ", "l", "e", "t", " ", "x", " ", "=", " ", "6"],
    ["}"],
    [],
];

function main() {
    const app = document.querySelector<HTMLDivElement>('#app')
    if (app) {
        app.appendChild(createBuffer(document, bufferWidth, bufferHeight));
        renderBuffer(app, bufferData)
    }
}

main();
