import { renderBuffer } from "./render-buffer";

export type Char = string;
export type Buffer = Char[][];
export type BufferStyle = {
    blockHeight: number;
    blockWidth: number;
    fontSize: number;
    bufferHeight: number;
    bufferWidth: number;
};

const createBlock = (document: Document, column: number, bufferStyle: BufferStyle): HTMLDivElement => {
    const displayBlock = document.createElement("div");

    displayBlock.style.minWidth = `${bufferStyle.blockWidth}px`;
    displayBlock.style.minHeight = `${bufferStyle.blockHeight}px`;
    displayBlock.style.display = "flex";
    displayBlock.style.justifyContent = "center";
    displayBlock.style.alignItems = "center";
    displayBlock.style.textAlign = "center";
    displayBlock.style.fontSize = `${bufferStyle.fontSize}px`;
    displayBlock.dataset.column = column.toString();

    const textNode = document.createTextNode("");
    displayBlock.appendChild(textNode);
    return displayBlock;
};

const createLine = (document: Document, row: number, bufferStyle: BufferStyle): HTMLDivElement => {
    const displayLine = document.createElement("div");

    displayLine.style.height = `${bufferStyle.blockHeight}px`;
    displayLine.style.display = "flex";
    displayLine.dataset.row = row.toString();

    for (let i = 0; i < bufferStyle.bufferWidth; i++) {
        if (i > 1_000_000) {
            break
        }
        displayLine.appendChild(createBlock(document, i, bufferStyle));
    }
    return displayLine;
};

export const createBuffer = (document: Document, bufferData: Buffer, bufferStyle: BufferStyle): void => {
    const displayBuffer = document.createElement("div");

    for (let i = 0; i < bufferStyle.bufferHeight; i++) {
        if (i > 1_000_000) {
            break
        }
        displayBuffer.appendChild(createLine(document, i, bufferStyle));
    }

    const app = document.querySelector<HTMLDivElement>('#app')
    if (app) {
        app.appendChild(displayBuffer);
        renderBuffer(app, bufferData, bufferStyle)
    }
};
