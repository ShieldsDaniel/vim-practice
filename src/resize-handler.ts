import { debounceTime, fromEvent } from "rxjs";

export const resizeHandler$ = (window: Window) => fromEvent(window, 'resize').pipe(debounceTime(200));
