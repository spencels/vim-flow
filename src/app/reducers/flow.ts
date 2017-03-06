import { Action } from '@ngrx/store'
import { Flow, Argument, Speech, ArgumentGroup, findArgument, createSpeech, createArgumentGroup } from '../models/flow'

// Actions

export const ActionTypes = {
    SelectArgument: '[flow] Select argument',
    DeleteArgument: '[flow] Delete argument'
}

export class SelectArgumentAction implements Action {
    type = ActionTypes.SelectArgument;
    constructor(public payload: Argument) {}
}

export function selectArgument(argument) {
    return new SelectArgumentAction(argument);
}

export class DeleteArgumentAction implements Action {
    type = ActionTypes.DeleteArgument;
    constructor(public payload: null = null) {}
}

export function deleteArgument() {
    return new DeleteArgumentAction();
}

export type Actions
    = SelectArgumentAction
    | DeleteArgumentAction

// Reducer

export const initialState: Flow = {
    argumentGroups: [],
    cursor: null
};

// Handles deletion of the argument at the cursor. Moves cursor to a new
// element.
//
// TODO: Cursor placement after deletion.
function deleteArgumentReducer(state: Flow, action: Actions) {
    if (!state.cursor) return state;

    const search = findArgument(state.argumentGroups, state.cursor);

    // TODO: Proper error handling.
    if (!search) return state;

    const newSpeech = createSpeech([
        ...search.speech.arguments.slice(0, search.iArgument),
        ...search.speech.arguments.slice(search.iArgument + 1)
    ]);
    const newArgumentGroup = createArgumentGroup([
        ...search.argumentGroup.speeches.slice(0, search.iSpeech),
        newSpeech,
        ...search.argumentGroup.speeches.slice(search.iSpeech + 1)
    ]);

    return {
        argumentGroups: [
            ...state.argumentGroups.slice(0, search.iArgumentGroup),
            newArgumentGroup,
            ...state.argumentGroups.slice(search.iArgumentGroup + 1)
        ],
        cursor: null
    };
}

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.SelectArgument: {
            return {
                argumentGroups: state.argumentGroups,
                cursor: action.payload
            }
        }

        case ActionTypes.DeleteArgument: {
            return deleteArgumentReducer(state, action);
        }

        default: {
            return state;
        }
    }
}