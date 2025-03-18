import { type Buffer, createBuffer, type BufferStyle } from './create-buffer';
import { keypressHandler$ } from './keypress-handler';
import { renderBuffer } from './render-buffer';
import './style.scss';

const buffer: Buffer = [
    null,
    "\"Hello World\"",
    null,
    "Hello",
    null,
    null,
    null,
    "function y() {",
    "  let x = 6",
    "}",
    null,
];

const displayedBuffer = (buffer: Buffer, bufferStyle: BufferStyle): Buffer => {
    const topTrimmedBuffer = buffer.slice(bufferStyle.topStartIndex, bufferStyle.topStartIndex + bufferStyle.bufferHeight);
    const leftTrimmedBuffer = [];
    for (let i = 0; i < topTrimmedBuffer.length; i++) {
        const line = topTrimmedBuffer[i];
        if (line) {
            leftTrimmedBuffer.push(line.slice(bufferStyle.leftStartIndex, bufferStyle.leftStartIndex + bufferStyle.bufferWidth));
        } else {
            leftTrimmedBuffer.push(null);
        }
    }
    return leftTrimmedBuffer;
}

function main() {
    const blockHeight = 19;
    const blockWidth = 9.64;
    let bufferStyle: BufferStyle = {
        blockHeight,
        blockWidth,
        fontSize: 16,
        bufferHeight: Math.floor(window.innerHeight / blockHeight),
        bufferWidth: Math.floor(window.innerWidth / blockWidth),
        topStartIndex: 0,
        leftStartIndex: 0,
        cursorPosition: [0, 0],
    };

    const bufferData = displayedBuffer(buffer, bufferStyle);
    const app = createBuffer(document, bufferData, bufferStyle);
    if (app) {
        keypressHandler$(window).subscribe((event) => {
            const newBufferStyle = { ...bufferStyle, cursorPosition: [bufferStyle.cursorPosition[0], bufferStyle.cursorPosition[1]] as [number, number] };
            if (event.type === 'keydown') {
                if (event.key === 'h') {
                    newBufferStyle.cursorPosition[1] = newBufferStyle.cursorPosition[1] - 1;
                } else if (event.key === 'k') {
                    newBufferStyle.cursorPosition[0] = newBufferStyle.cursorPosition[0] - 1;
                } else if (event.key === 'j') {
                    newBufferStyle.cursorPosition[0] = newBufferStyle.cursorPosition[0] + 1;
                } else if (event.key === 'l') {
                    newBufferStyle.cursorPosition[1] = newBufferStyle.cursorPosition[1] + 1;
                }
                renderBuffer(app, [bufferData, bufferData], [bufferStyle, newBufferStyle])
                bufferStyle = newBufferStyle;
            }
        });
    }
}

main();
