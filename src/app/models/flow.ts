export interface Argument {
    contents: string
};

export type Speech = Argument[]

export type ArgumentGroup = Speech[]

export class Flow {
    // Outer list is speeches, inner list is arguments.
    argumentGroups: ArgumentGroup[] = [];
    cursor: Argument = null;

    findArgument(argument: Argument) {
        for (var iGroup = 0; iGroup < this.argumentGroups.length; iGroup++) {
            let argumentGroup = this.argumentGroups[iGroup];
            for (var iSpeech = 0; iSpeech < argumentGroup.length;
                    iSpeech++) {
                let speech = argumentGroup[iSpeech];
                for (var iArgument = 0; iArgument < speech.length;
                        iArgument++) {
                    let testArgument = speech[iArgument];
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

    // Finds (argumentGroup, speech, argument) index tuple for the given argument.
    // Returns null if not found.
    deleteArgumentAtCursor() {
        if (this.cursor == null) throw "null cursor"
        let { iArgumentGroup, iSpeech, iArgument } =
            this.findArgument(this.cursor);
        this.argumentGroups[iArgumentGroup][iSpeech].splice(iArgument, 1);
        if (this.argumentGroups[iArgumentGroup][iSpeech].length == 0) {
            this.argumentGroups[iArgumentGroup].splice(iSpeech, 1);
        }
        this.cursor = null;
    }

    countSpeeches() {
        return this.argumentGroups.map(x => x.length)
            .reduce((acc, val) => Math.max(acc, val));
    }
}