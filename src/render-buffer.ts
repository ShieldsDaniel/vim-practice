import type { Buffer, BufferStyle } from './create-buffer';

const hasNewText = (bufferData: [Buffer, Buffer], row: number, column: number): boolean => (
    bufferData[0][row]?.[column] !== bufferData[1][row]?.[column]
);

const isPositionInBuffer = (cursorPosition: [number, number], row: number, column: number): boolean => (
    cursorPosition[0] === row && cursorPosition[1] === column
);

const hasNewCursorPosition = (bufferStyle: [BufferStyle, BufferStyle]): boolean => (
    bufferStyle[0].cursorPosition[0] !== bufferStyle[1].cursorPosition[0] ||
    bufferStyle[0].cursorPosition[1] !== bufferStyle[1].cursorPosition[1]
);

const getBlock = (buffer: HTMLDivElement, row: number, column: number) => buffer.querySelector<HTMLDivElement>(`div[data-row="${row}"] div[data-column="${column}"]`);

export const renderBuffer = (buffer: HTMLDivElement, bufferData: [Buffer, Buffer], bufferStyle: [BufferStyle, BufferStyle]): void => {
    for (let i = 0; i < bufferStyle[1].bufferHeight; i++) {
        for (let j = 0; j < bufferStyle[1].bufferWidth; j++) {
            const newText = hasNewText(bufferData, i, j);
            const newCursorPosition = hasNewCursorPosition(bufferStyle);
            if (newText || newCursorPosition) {
                if (newText) {
                    const block = getBlock(buffer, i, j);
                    if (block) {
                        block.innerText = bufferData[1][i]?.[j] ?? '';
                    }
                }
                if (newCursorPosition) {
                    if (isPositionInBuffer(bufferStyle[0].cursorPosition, i, j)) {
                        const block = getBlock(buffer, i, j);
                        if (block) {
                            block.classList.remove('cursor');
                        }
                    } else if (isPositionInBuffer(bufferStyle[1].cursorPosition, i, j)) {
                        const block = getBlock(buffer, i, j);
                        if (block) {
                            block.classList.add('cursor');
                        }
                    }
                }
            }
        }
    }
}

export const newRenderBuffer = () => {

};
