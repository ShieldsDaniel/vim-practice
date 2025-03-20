// import { type Buffer, createBuffer, type BufferStyle } from './create-buffer';
// import { keypressHandler$ } from './keypress-handler';
// import { renderBuffer } from './render-buffer';
// import './style.scss';
//
// const buffer: Buffer = [
//     null,
//     "\"Hello World\"",
//     null,
//     "Hello",
//     null,
//     null,
//     null,
//     "function y() {",
//     "  let x = 6",
//     "}",
//     null,
// ];
//
// const displayedBuffer = (buffer: Buffer, bufferStyle: BufferStyle): Buffer => {
//     const topTrimmedBuffer = buffer.slice(bufferStyle.topStartIndex, bufferStyle.topStartIndex + bufferStyle.bufferHeight);
//     const leftTrimmedBuffer = [];
//     for (let i = 0; i < topTrimmedBuffer.length; i++) {
//         const line = topTrimmedBuffer[i];
//         if (line) {
//             leftTrimmedBuffer.push(line.slice(bufferStyle.leftStartIndex, bufferStyle.leftStartIndex + bufferStyle.bufferWidth));
//         } else {
//             leftTrimmedBuffer.push(null);
//         }
//     }
//     return leftTrimmedBuffer;
// }
//
// function main() {
//     const blockHeight = 19;
//     const blockWidth = 9.64;
//     let bufferStyle: BufferStyle = {
//         blockHeight,
//         blockWidth,
//         fontSize: 16,
//         bufferHeight: Math.floor(window.innerHeight / blockHeight),
//         bufferWidth: Math.floor(window.innerWidth / blockWidth),
//         topStartIndex: 0,
//         leftStartIndex: 0,
//         cursorPosition: [0, 0],
//     };
//
//     const bufferData = displayedBuffer(buffer, bufferStyle);
//     const app = createBuffer(document, bufferData, bufferStyle);
//     if (app) {
//         keypressHandler$(window).subscribe((event) => {
//             const newBufferStyle = { ...bufferStyle, cursorPosition: [bufferStyle.cursorPosition[0], bufferStyle.cursorPosition[1]] as [number, number] };
//             if (event.type === 'keydown') {
//                 if (event.key === 'h') {
//                     newBufferStyle.cursorPosition[1] = newBufferStyle.cursorPosition[1] - 1;
//                 } else if (event.key === 'k') {
//                     newBufferStyle.cursorPosition[0] = newBufferStyle.cursorPosition[0] - 1;
//                 } else if (event.key === 'j') {
//                     newBufferStyle.cursorPosition[0] = newBufferStyle.cursorPosition[0] + 1;
//                 } else if (event.key === 'l') {
//                     newBufferStyle.cursorPosition[1] = newBufferStyle.cursorPosition[1] + 1;
//                 }
//                 renderBuffer(app, [bufferData, bufferData], [bufferStyle, newBufferStyle])
//                 bufferStyle = newBufferStyle;
//             }
//         });
//     }
// }
//
// main();

import './style.scss';
import { keypressHandler$ } from './keypress-handler';

const monoCharWidth = 9.64;
const monoCharHeight = 19;

type BufferData = {
    buffer: string; // the file's contents
    bufferAsArray: string[]; // the file's contents as an array for lookup
    scrollPositionY: number; // how far down the buffer is scrolled based on the fist shown line
    scrollPositionX: number; // how far right the buffer is scrolled based on the first shown column
    cursorPosition: { x: number; y: number; }; // where the cursor is in the file
};

const textToHtml = (text: string): string => text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');

const renderBuffer = (bufferData: BufferData): HTMLDivElement | null => {
    const buffer = document.querySelector<HTMLDivElement>('#buffer');
    if (buffer) {
        const cursorYOffset = bufferData.cursorPosition.y * monoCharHeight;
        const cursorXOffset = bufferData.cursorPosition.x * monoCharWidth;
        const charUnderCursor = bufferData.bufferAsArray[bufferData.cursorPosition.y][bufferData.cursorPosition.x];
        buffer.innerHTML = `<div id="cursor" style="top: ${cursorYOffset}px; left: ${cursorXOffset}">${charUnderCursor}</div>
            ${textToHtml(bufferData.buffer)}`;
    }
    return buffer;
}

const moveCursor = (bufferData: BufferData) => {
    const cursor = document.querySelector<HTMLDivElement>('#cursor');
    if (cursor) {
        const cursorYOffset = bufferData.cursorPosition.y * monoCharHeight;
        const cursorXOffset = bufferData.cursorPosition.x * monoCharWidth;
        const charUnderCursor = bufferData.bufferAsArray[bufferData.cursorPosition.y][bufferData.cursorPosition.x] ?? '';
        cursor.style.top = `${cursorYOffset}px`;
        cursor.style.left = `${cursorXOffset}px`;
        cursor.innerText = charUnderCursor;
    }
}

function newMain() {
    // * render full buffer in div with overflow hidden
    //   * manually scroll the buffer when needed
    //   * render cursor in the correct position based on where it is in the file along with where the buffer is currently scrolled to
    //     * Cursor position can be calculated by the current position and the file's scroll position
    // * Handle resizes by debouncing until stable and then re-rendering the whole all using the logic from the old example
    const file = 'Hello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello World\n\nHello\nWorld\n!\n\n\nfunction y() {\n  let x = 6\n}\n\n\n';
    let bufferData: BufferData = {
        buffer: file,
        bufferAsArray: file.split('\n'),
        scrollPositionY: 0,
        scrollPositionX: 0,
        cursorPosition: { y: 0, x: 0 },
    };
    const app = renderBuffer(bufferData);
    if (app) {
        keypressHandler$(window).subscribe((event) => {
            const newBufferData: BufferData = { ...bufferData, cursorPosition: { ...bufferData.cursorPosition } };
            if (event.type === 'keydown') {
                if (event.key === 'h') {
                    newBufferData.cursorPosition.x = newBufferData.cursorPosition.x - 1;
                } else if (event.key === 'k') {
                    newBufferData.cursorPosition.y = newBufferData.cursorPosition.y - 1;
                } else if (event.key === 'j') {
                    newBufferData.cursorPosition.y = newBufferData.cursorPosition.y + 1;
                } else if (event.key === 'l') {
                    newBufferData.cursorPosition.x = newBufferData.cursorPosition.x + 1;
                }
                moveCursor(newBufferData)
                bufferData = newBufferData;
            }
        });
    }
}

newMain();
