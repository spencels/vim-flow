
export interface Argument {
  contents: string
};

export type Speech = Argument[]

export type ArgumentGroup = Speech[]

export class Cursor {
  constructor(
    public iArgumentGroup: number,
    public iSpeech: number,
    public iArgument: number) {}

  // Sentinel value for when no values are selected.
  public static readonly EMPTY = new Cursor(-1, -1, -1)
}

export class Flow {
  // Outer list is speeches, inner list is arguments.
  argumentGroups: ArgumentGroup[] = [];

  // Coordinates of selected argument.
  cursor: Cursor = Cursor.EMPTY

  // Selected argument, or null if no argument is present at coordinates.
  selectedArgument: Argument | null = null;

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
            return new Cursor(iGroup, iSpeech, iArgument)
          }
        }
      }
    }
    return null
  }

  // Sets cursor to new argument.
  selectArgument(argument: Argument) {
    if (argument) {
      this.cursor = this.findArgument(argument)
      this.selectedArgument = argument
    } else {
      this.cursor = Cursor.EMPTY
      this.selectedArgument = null;
    }
  }

  // Sets cursor to provided coordinates.
  moveCursor(iArgumentGroup, iSpeech, iArgument) {
    this.selectedArgument = this.getArgument(iArgumentGroup, iSpeech, iArgument)
    this.cursor = new Cursor(iArgumentGroup, iSpeech, iArgument)
    
  }

  // Gets argument at cursor, or null if it doesn't exist.
  getArgument(iArgumentGroup: number, iSpeech: number, iArgument: number) {
    if (iArgumentGroup >= this.argumentGroups.length
        || iSpeech >= this.argumentGroups[iArgumentGroup].length
        || iArgument >= this.argumentGroups[iArgumentGroup][iSpeech].length) {
      return null
    }
    const speech = this.argumentGroups[iArgumentGroup][iSpeech]
    return speech[iArgument]
  }

  // Places cursor in the default location, if cursor is not already set.
  // Returns true if cursor was set, or if cursor cannot be set.
  trySetDefaultCursor() {
    if (this.selectedArgument) return false;

    if (this.argumentGroups.length > 0
        && this.argumentGroups[0].length > 0
        && this.argumentGroups[0][0].length > 0) {
      this.selectedArgument = this.argumentGroups[0][0][0];
      return true;
    }

    return false;
  }

  // Moves cursor down to next argument.
  selectDown() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    let { iArgumentGroup, iSpeech, iArgument } =
      this.findArgument(this.selectedArgument)
    
    iArgument += 1;
    if (iArgument < this.argumentGroups[iArgumentGroup][iSpeech].length) {
        this.moveCursor(iArgumentGroup, iSpeech, iArgument)
      return;
    }

    // Move to next argument group.
    iArgumentGroup += 1;
    while (iArgumentGroup < this.argumentGroups.length) {
      let hasSpeech = iSpeech < this.argumentGroups[iArgumentGroup].length
      if (hasSpeech) {
        if (this.argumentGroups[iArgumentGroup][iSpeech].length > 0) {
          this.moveCursor(iArgumentGroup, iSpeech, 0)
          return;
        }
      }
      iArgumentGroup += 1;
    }
  }

  // Moves cursor up to next argument.
  selectUp() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    let { iArgumentGroup, iSpeech, iArgument } =
      this.findArgument(this.selectedArgument)
    
    iArgument -= 1;
    if (iArgument >= 0) {
      this.moveCursor(iArgumentGroup, iSpeech, iArgument)
      return;
    }

    // Move to next argument group.
    iArgumentGroup -= 1;
    while (iArgumentGroup >= 0) {
      let hasSpeech = iSpeech < this.argumentGroups[iArgumentGroup].length
      if (hasSpeech) {
        const speechLength = this.argumentGroups[iArgumentGroup][iSpeech].length 
        if (speechLength > 0) {
          this.moveCursor(iArgumentGroup, iSpeech, speechLength - 1)
          return;
        }
      }
      iArgumentGroup -= 1;
    }
  }

  // Move cursor to the right.
  selectRight() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    let { iArgumentGroup, iSpeech, iArgument } =
      this.findArgument(this.selectedArgument)
  
    iSpeech += 1
    const speechesCount = this.argumentGroups[iArgumentGroup].length
    if (iSpeech < speechesCount) {
      // Move to same argument if it exists.
      const argumentsCount = this.argumentGroups[iArgumentGroup][iSpeech].length
      if (iArgument >= argumentsCount) iArgument = argumentsCount - 1
      this.selectedArgument = this.argumentGroups[iArgumentGroup][iSpeech][iArgument]
      this.moveCursor(iArgumentGroup, iSpeech, iArgument)
    }
  }

  // Move cursor to the right.
  selectLeft() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    let { iArgumentGroup, iSpeech, iArgument } =
      this.findArgument(this.selectedArgument)
  
    iSpeech -= 1
    if (iSpeech >= 0) {
      // Move to same argument if it exists.
      const argumentsCount = this.argumentGroups[iArgumentGroup][iSpeech].length
      if (iArgument >= argumentsCount) iArgument = argumentsCount - 1
      this.moveCursor(iArgumentGroup, iSpeech, iArgument)
    }
  }

  // Finds (argumentGroup, speech, argument) index tuple for the given argument.
  // Returns null if not found.
  deleteArgumentAtCursor() {
    if (this.selectedArgument == null) throw "null cursor"
    let { iArgumentGroup, iSpeech, iArgument } =
      this.findArgument(this.selectedArgument);
    this.argumentGroups[iArgumentGroup][iSpeech].splice(iArgument, 1);
    if (this.argumentGroups[iArgumentGroup][iSpeech].length == 0) {
      this.argumentGroups[iArgumentGroup].splice(iSpeech, 1);
    }
    this.selectArgument(null)

    this.deleteArgumentGroupIfEmpty()
  }

  deleteArgumentGroupIfEmpty() {
      // TODO: implement me.
  }

  countSpeeches() {
    return this.argumentGroups.map(x => x.length)
      .reduce((acc, val) => Math.max(acc, val));
  }
}