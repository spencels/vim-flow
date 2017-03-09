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

    selectArgument(argument: Argument) {
        this.cursor = argument;
    }

    // Moves cursor down to next argument.
    selectDown() {
        // If nothing selected, select first argument.
        if (!this.cursor) {
            if (this.argumentGroups.length > 0
                    && this.argumentGroups[0].length > 0
                    && this.argumentGroups[0][0].length > 0) {
                this.cursor = this.argumentGroups[0][0][0];
                return;
            } else {
                return;
            }
        }

        let { iArgumentGroup, iSpeech, iArgument } =
            this.findArgument(this.cursor)
        
        iArgument += 1;
        if (iArgument < this.argumentGroups[iArgumentGroup][iSpeech].length) {
            this.cursor = this.argumentGroups[iArgumentGroup][iSpeech][iArgument];
            return;
        }

        // Move to next argument group.
        iArgumentGroup += 1;
        while (iArgumentGroup < this.argumentGroups.length) {
            let hasSpeech = iSpeech < this.argumentGroups[iArgumentGroup].length
            if (hasSpeech) {
                if (this.argumentGroups[iArgumentGroup][iSpeech].length > 0) {
                    this.cursor = this.argumentGroups[iArgumentGroup][iSpeech][0];
                    return;
                }
            }
            iArgumentGroup += 1;
        }
    }

    // Moves cursor up to next argument.
    selectUp() {
        // If nothing selected, select first argument.
        if (!this.cursor) {
            if (this.argumentGroups.length > 0
                    && this.argumentGroups[0].length > 0
                    && this.argumentGroups[0][0].length > 0) {
                this.cursor = this.argumentGroups[0][0][0];
                return;
            } else {
                return;
            }
        }

        let { iArgumentGroup, iSpeech, iArgument } =
            this.findArgument(this.cursor)
        
        iArgument -= 1;
        if (iArgument >= 0) {
            this.cursor = this.argumentGroups[iArgumentGroup][iSpeech][iArgument];
            return;
        }

        // Move to next argument group.
        iArgumentGroup -= 1;
        while (iArgumentGroup >= 0) {
            let hasSpeech = iSpeech < this.argumentGroups[iArgumentGroup].length
            if (hasSpeech) {
                const speechLength = this.argumentGroups[iArgumentGroup][iSpeech].length 
                if (speechLength > 0) {
                    this.cursor = this.argumentGroups[iArgumentGroup][iSpeech][speechLength - 1];
                    return;
                }
            }
            iArgumentGroup -= 1;
        }
    }

    // Move cursor to the right.
    selectRight() {
        // If nothing selected, select first argument.
        if (!this.cursor) {
            if (this.argumentGroups.length > 0
                    && this.argumentGroups[0].length > 0
                    && this.argumentGroups[0][0].length > 0) {
                this.cursor = this.argumentGroups[0][0][0];
                return
            } else {
                return
            }
        }

        let { iArgumentGroup, iSpeech, iArgument } =
            this.findArgument(this.cursor)
    
        iSpeech += 1
        const speechesCount = this.argumentGroups[iArgumentGroup].length
        if (iSpeech < speechesCount) {
            // Move to same argument if it exists.
            const argumentsCount = this.argumentGroups[iArgumentGroup][iSpeech].length
            if (iArgument >= argumentsCount) iArgument = argumentsCount - 1
            this.cursor = this.argumentGroups[iArgumentGroup][iSpeech][iArgument]
        }
    }

    // Move cursor to the right.
    selectLeft() {
        // If nothing selected, select first argument.
        if (!this.cursor) {
            if (this.argumentGroups.length > 0
                    && this.argumentGroups[0].length > 0
                    && this.argumentGroups[0][0].length > 0) {
                this.cursor = this.argumentGroups[0][0][0];
                return
            } else {
                return
            }
        }

        let { iArgumentGroup, iSpeech, iArgument } =
            this.findArgument(this.cursor)
    
        iSpeech -= 1
        if (iSpeech >= 0) {
            // Move to same argument if it exists.
            const argumentsCount = this.argumentGroups[iArgumentGroup][iSpeech].length
            if (iArgument >= argumentsCount) iArgument = argumentsCount - 1
            this.cursor = this.argumentGroups[iArgumentGroup][iSpeech][iArgument]
        }
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