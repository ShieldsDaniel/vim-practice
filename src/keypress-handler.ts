import { fromEvent, tap } from "rxjs";

export const keydownHandler$ = (window: Window) => fromEvent<KeyboardEvent>(window, 'keydown').pipe(
    tap((event) => event.preventDefault()),
);

export const keyupHandler$ = (window: Window) => fromEvent<KeyboardEvent>(window, 'keyup').pipe(
    tap((event) => event.preventDefault()),
);
