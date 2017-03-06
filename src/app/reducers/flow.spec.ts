import { TestBed, async } from '@angular/core/testing';

import * as models from '../models/flow'
import * as flow from './flow'

describe('reducers/flow', () => {
    // 
    it('DeleteArgument: should do nothing if cursor is null', async(() => {
        const beforeState = {
            argumentGroups: [],
            cursor: null
        };
        const afterState = flow.reducer(beforeState, flow.deleteArgument());
        expect(afterState).toEqual(beforeState);
    }));

    it('DeleteArgument: should preserve argument order', async(() => {
        let beforeState = {
            argumentGroups: [
                models.createArgumentGroup([
                    models.createSpeech([
                        {
                            contents: 'Argument 1'
                        },
                        {
                            contents: 'Argument 2'
                        },
                        {
                            contents: 'Argument 3'
                        }
                    ])
                ])
            ],
            cursor: null
        };
        const arg1 = beforeState.argumentGroups[0].speeches[0].arguments[0];
        const arg2 = beforeState.argumentGroups[0].speeches[0].arguments[1];
        const arg3 = beforeState.argumentGroups[0].speeches[0].arguments[2];
        beforeState.cursor = arg2

        const expectedState = {
            argumentGroups: [
                models.createArgumentGroup([
                    models.createSpeech([
                        arg1,
                        arg3
                    ])
                ])
            ],
            cursor: null
        };

        const afterState = flow.reducer(beforeState, flow.deleteArgument());
        expect(afterState).toEqual(expectedState);
    }))

    it('DeleteArgument: should not delete other argumentGroups', async(() => {
        let beforeState = {
            argumentGroups: [
                models.createArgumentGroup([]),
                models.createArgumentGroup([
                    models.createSpeech([
                        {
                            contents: 'Argument 1'
                        },
                        {
                            contents: 'Argument 2'
                        }
                    ])
                ]),
            ],
            cursor: null
        };
        const arg1 = beforeState.argumentGroups[1].speeches[0].arguments[0];
        const arg2 = beforeState.argumentGroups[1].speeches[0].arguments[1];
        beforeState.cursor = arg1

        const expectedState = {
            argumentGroups: [
                models.createArgumentGroup([]),
                models.createArgumentGroup([
                    models.createSpeech([
                        arg2
                    ])
                ])
            ],
            cursor: null
        };

        const afterState = flow.reducer(beforeState, flow.deleteArgument());
        expect(afterState).toEqual(expectedState);
    }))

    it('DeleteArgument: should not delete other speeches', async(() => {
        let beforeState = {
            argumentGroups: [
                models.createArgumentGroup([
                    models.createSpeech([]),
                    models.createSpeech([
                        {
                            contents: 'Argument 1'
                        },
                        {
                            contents: 'Argument 2'
                        }
                    ])
                ]),
            ],
            cursor: null
        };
        const arg1 = beforeState.argumentGroups[0].speeches[1].arguments[0];
        const arg2 = beforeState.argumentGroups[0].speeches[1].arguments[1];
        beforeState.cursor = arg1

        const expectedState = {
            argumentGroups: [
                models.createArgumentGroup([
                    models.createSpeech([]),
                    models.createSpeech([
                        arg2
                    ])
                ])
            ],
            cursor: null
        };

        const afterState = flow.reducer(beforeState, flow.deleteArgument());
        expect(afterState).toEqual(expectedState);
    }))
});