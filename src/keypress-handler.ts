import { fromEvent, merge, tap } from "rxjs";

// const macro: (string | number)[] = [];

const keydownHandler$ = (window: Window) => fromEvent<KeyboardEvent>(window, 'keydown').pipe(
    tap((event) => event.preventDefault()),
);

const keyupHandler$ = (window: Window) => fromEvent<KeyboardEvent>(window, 'keyup').pipe(
    tap((event) => event.preventDefault()),
);

export const keypressHandler$ = (window: Window) => merge(keydownHandler$(window), keyupHandler$(window));
