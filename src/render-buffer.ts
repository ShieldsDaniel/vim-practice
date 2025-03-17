import type { Buffer, BufferStyle } from './create-buffer';

export const renderBuffer = (buffer: HTMLDivElement, bufferData: Buffer, bufferStyle: BufferStyle): void => {
    for (let i = 0; i < bufferStyle.bufferHeight; i++) {
        for (let j = 0; j < bufferStyle.bufferWidth; j++) {
            const block = buffer.querySelector<HTMLDivElement>(`div[data-row="${i}"] div[data-column="${j}"]`);
            if (block) {
                block.innerText = bufferData[i]?.[j] ?? '';
            }
        }
    }
}

