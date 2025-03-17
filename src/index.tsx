import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { fromEvent } from 'rxjs';
import { SignColumn } from './components/sign-column';
import { Buffer } from './components/buffer';
import { StatusLine } from './components/status-line';
import { CommandLine } from './components/command-line';
import './style.scss';

const updateBufferHeightOnResize$ = fromEvent(window, 'resize');

function updateBufferHeight() {
    const lineHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--line-height'));
    const numLines = Math.floor(window.innerHeight / lineHeight) - 2;
    document.documentElement.style.setProperty('--buffer-lines', numLines.toString());
}

export const App = () => {
    useEffect(() => {
        updateBufferHeight();
        updateBufferHeightOnResize$.subscribe(updateBufferHeight);
    }, [])
    return (
        <>
            <SignColumn />
            <Buffer />
            <StatusLine />
            <CommandLine />
        </>
    );
};

render(<App />, document.getElementById('app'));
