import { type Buffer, createBuffer, type BufferStyle } from './create-buffer';
import { keydownHandler$, keyupHandler$ } from './keypress-handler';
import './style.scss';

function main() {
    const blockHeight = 19;
    const blockWidth = 9.64;
    const bufferStyle: BufferStyle = {
        blockHeight,
        blockWidth,
        fontSize: 16,
        bufferHeight: Math.floor(window.innerHeight / blockHeight),
        bufferWidth: Math.floor(window.innerWidth / blockWidth),
    };
    // const topStartIndex = 0;
    // const leftStartIndex = 0;

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

    createBuffer(document, bufferData, bufferStyle);
    keydownHandler$(window).subscribe((event) => {
        console.log('keydown: ', event);
    });
    keyupHandler$(window).subscribe((event) => {
        console.log('keyup: ', event);
    });
}

main();
