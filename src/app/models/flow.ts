export interface Argument {
    contents: string
};

export interface Speech {
    arguments: Argument[]
};

export function createSpeech(arguments_: Argument[]) {
    return {
        arguments: arguments_
    };
}

export interface ArgumentGroup {
    speeches: Speech[]
};

export function createArgumentGroup(speeches: Speech[]) {
    return { speeches };
}

export interface Flow {
    // Outer list is speeches, inner list is arguments.
    argumentGroups: ArgumentGroup[];
    cursor: Argument;
}

export function createFlow(argumentGroups: ArgumentGroup[], cursor: Argument) {
    return { argumentGroups, cursor
    };
}

export class ArgumentSelection {
    constructor(
        public iArgumentGroup: number,
        public iSpeech: number,
        public iArgument: number) {}
}

// Finds (argumentGroup, speech, argument) index tuple for the given argument.
// Returns null if not found.
export function findArgument(
        argumentGroups: ArgumentGroup[], argument: Argument) {
    for (var iGroup = 0; iGroup < argumentGroups.length; iGroup++) {
        let argumentGroup = argumentGroups[iGroup];
        for (var iSpeech = 0; iSpeech < argumentGroup.speeches.length;
                iSpeech++) {
            let speech = argumentGroup.speeches[iSpeech];
            for (var iArgument = 0; iArgument < speech.arguments.length;
                    iArgument++) {
                let testArgument = speech.arguments[iArgument];
                if (Object.is(testArgument, argument)) {
                    return {
                        iArgumentGroup: iGroup,
                        iSpeech: iSpeech,
                        iArgument: iArgument,
                        argumentGroup: argumentGroup,
                        speech: speech,
                        argument: argument
                    };
                }
            }
        }
    }
    return null
}