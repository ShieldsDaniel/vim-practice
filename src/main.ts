import './style.scss';
import { keypressHandler$ } from './keypress-handler';

const monoCharWidth = 9.64;
const monoCharHeight = 19;

type Mode = 'normal' | 'insert' | 'visual' | 'visual-line' | 'visual-block' | 'command';

type BufferData = {
    buffer: string; // the file's contents
    bufferAsArray: string[]; // the file's contents as an array for lookup
    mode: Mode; // the mode the editor
    scrollPositionY: number; // how far down the buffer is scrolled based on the fist shown line
    scrollPositionX: number; // how far right the buffer is scrolled based on the first shown column
    lastCursorXPosition: number; // the last known cursor position on the x axis
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
    const file = 'Hello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello World\n\nHello\nWorld\n!\n\n\nfunction y() {\n  let x = 6\n}\n\n\n';
    let bufferData: BufferData = {
        buffer: file,
        bufferAsArray: file.split('\n'),
        mode: 'normal',
        scrollPositionY: 0,
        scrollPositionX: 0,
        lastCursorXPosition: 0,
        cursorPosition: { y: 0, x: 0 },
    };
    const app = renderBuffer(bufferData);
    if (app) {
        keypressHandler$(window).subscribe((event) => {
            // INFO: This should look at the key pressed and wait a small amount of time to wait for another key if there is a key binding that starts with the current macro
            // We could also keep a list of key binds as a Record<string, (d: BufferData) => BufferData)>
            // We could also try to make this performant and use some sort of tree structure to look up the partial key binds
            const newBufferData: BufferData = { ...bufferData, cursorPosition: { ...bufferData.cursorPosition } };
            if (event.type === 'keydown') {
                let newCursorPositionX = bufferData.cursorPosition.x;
                let newCursorPositionY = bufferData.cursorPosition.y;
                const handleXOnYMovement = (newY: number) => {
                    if (bufferData.lastCursorXPosition > bufferData.bufferAsArray[newY].length) {
                        newCursorPositionX = bufferData.bufferAsArray[newY].length - 1;
                        if (newCursorPositionX < 0) {
                            newCursorPositionX = 0;
                        }
                    } else {
                        newCursorPositionX = bufferData.lastCursorXPosition;
                    }
                }
                if (event.key === 'h') {
                    if (newCursorPositionX - 1 >= 0) {
                        newCursorPositionX = newBufferData.cursorPosition.x - 1;
                    }
                    newBufferData.lastCursorXPosition = newCursorPositionX;
                    newBufferData.cursorPosition.x = newCursorPositionX;
                } else if (event.key === 'l') {
                    if (newCursorPositionX + 1 < bufferData.bufferAsArray[bufferData.cursorPosition.y].length) {
                        newCursorPositionX = newBufferData.cursorPosition.x + 1;
                    }
                    newBufferData.lastCursorXPosition = newCursorPositionX;
                    newBufferData.cursorPosition.x = newCursorPositionX;
                } else if (event.key === 'k') {
                    if (newCursorPositionY - 1 >= 0) {
                        newCursorPositionY = newBufferData.cursorPosition.y - 1;
                    }
                    handleXOnYMovement(newCursorPositionY);
                    newBufferData.cursorPosition.y = newCursorPositionY;
                    newBufferData.cursorPosition.x = newCursorPositionX;
                } else if (event.key === 'j') {
                    if (newCursorPositionY + 1 < bufferData.bufferAsArray.length - 1) {
                        newCursorPositionY = newBufferData.cursorPosition.y + 1;
                    }
                    handleXOnYMovement(newCursorPositionY);
                    newBufferData.cursorPosition.y = newCursorPositionY;
                    newBufferData.cursorPosition.x = newCursorPositionX;
                }
                moveCursor(newBufferData)
                bufferData = newBufferData;
            }
        });
    }
}

newMain();
