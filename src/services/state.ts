import { BehaviorSubject } from "rxjs";

export type State = {
    cursorPosition: [number, number];
};

const stateInternal$ = new BehaviorSubject<State>({
    cursorPosition: [0, 0],
});

export function updateState(newState: Partial<State>) {
    stateInternal$.next({ ...stateInternal$.value, ...newState });
}

export const state$ = stateInternal$.asObservable();
