
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

  // Number of speeches. This is used to determine how far right the cursor can
  // move.
  speechesCount: number = 2

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
    if (this.selectedArgument) {
      this.cursor = new Cursor(iArgumentGroup, iSpeech, iArgument)
    }
    else if (iArgumentGroup < 0
        || iArgumentGroup > this.argumentGroups.length) {
      // Invalid selection
      this.cursor = Cursor.EMPTY
    } else {
      // Select empty speech.
      this.cursor = new Cursor(iArgumentGroup, iSpeech, 0)
    }
  }

  selectSpeech(iArgumentGroup, iSpeech) {
    this.moveCursor(iArgumentGroup, iSpeech, 0)
  }

  // Gets argument at coordinates, or null if it doesn't exist.
  getArgument(iArgumentGroup: number, iSpeech: number, iArgument: number) {
    if (iArgumentGroup >= this.argumentGroups.length
        || iSpeech >= this.argumentGroups[iArgumentGroup].length
        || iArgument >= this.argumentGroups[iArgumentGroup][iSpeech].length) {
      return null
    }
    const speech = this.argumentGroups[iArgumentGroup][iSpeech]
    return speech[iArgument]
  }

  // Gets speech at coordinates, or null if it doesn't exist.
  getSpeech(iArgumentGroup: number, iSpeech: number) {
    if (iArgumentGroup >= this.argumentGroups.length
        || iSpeech >= this.argumentGroups[iArgumentGroup].length) {
      return null
    }
    return this.argumentGroups[iArgumentGroup][iSpeech]
  }

  // Places cursor in the default location, if cursor is not already set.
  // Returns true if cursor was set, or if cursor cannot be set.
  trySetDefaultCursor() {
    if (this.cursor !== Cursor.EMPTY) return false;

    this.moveCursor(0, 0, 0)
    return this.cursor !== Cursor.EMPTY
  }

  // Moves cursor down to next argument.
  selectDown() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    const { iArgumentGroup, iSpeech, iArgument } = this.cursor
    if (this.argumentGroups[iArgumentGroup][iSpeech]) {
      const speechLength = this.argumentGroups[iArgumentGroup][iSpeech].length
      if (iArgument + 1 < speechLength) {
        this.moveCursor(iArgumentGroup, iSpeech, iArgument + 1)
        return;
      }
    }

    // Don't move past last argument group.
    if (iArgumentGroup + 1 >= this.argumentGroups.length) return;
    
    this.moveCursor(iArgumentGroup + 1, iSpeech, 0)
  }

  // Moves cursor up to next argument.
  selectUp() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    const { iArgumentGroup, iSpeech, iArgument } = this.cursor
    
    if (iArgument >= 1) {
      this.moveCursor(iArgumentGroup, iSpeech, iArgument - 1)
      return;
    }

    // If this is the top argument group, move no farther.
    if (iArgumentGroup == 0) return;

    // Move to next argument group.
    const iNextArgumentGroup = iArgumentGroup - 1
    const nextSpeech = this.getSpeech(iNextArgumentGroup, iSpeech)
    const iNextArgument = nextSpeech ? nextSpeech.length - 1 : 0
    this.moveCursor(iArgumentGroup - 1, iSpeech, iNextArgument);
  }

  // Move cursor to the right.
  selectRight() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    const { iArgumentGroup, iSpeech, iArgument } = this.cursor

    // Only allow cursor to go 1 speech past the max.
    if (iSpeech + 1 >= this.speechesCount + 1) return;

    // Adjust iArgument if new speech is smaller than the cursor. Set to 0 if
    // no arguments are present.
    const newSpeech = this.getSpeech(iArgumentGroup, iSpeech + 1)
    const iNewArgument = newSpeech
      ? (iArgument < newSpeech.length ? iArgument : newSpeech.length - 1)
      : 0
    this.moveCursor(iArgumentGroup, iSpeech + 1, iNewArgument)
  }

  // Move cursor to the right.
  selectLeft() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    const { iArgumentGroup, iSpeech, iArgument } = this.cursor 

    if (iSpeech - 1 < 0) return;
    this.moveCursor(iArgumentGroup, iSpeech - 1, iArgument)
  }

  // Finds (argumentGroup, speech, argument) index tuple for the given argument.
  // Returns null if not found.
  deleteArgumentAtCursor() {
    if (this.selectedArgument == null) throw "null cursor"

    let { iArgumentGroup, iSpeech, iArgument } = this.cursor

    this.argumentGroups[iArgumentGroup][iSpeech].splice(iArgument, 1);

    this.selectArgument(null)
    this.deleteArgumentGroupIfEmpty(iArgumentGroup)

    // If argument was the last argument in the last speech, recalculate speeches
    this.speechesCount = this.countSpeeches()
  }

  deleteArgumentGroupIfEmpty(iArgumentGroup: number) {
    // Don't delete the last group.
    if (this.argumentGroups.length <= 1) return;

    const argumentGroupIsEmpty = this.argumentGroups[iArgumentGroup]
      .every(speech => speech.length == 0)
    if (argumentGroupIsEmpty) {
      this.argumentGroups.splice(iArgumentGroup, 1)
    }

    // Move cursor.
    this.selectArgument(null)
  }

  countSpeeches() {
    return this.argumentGroups.map(x => x.length)
      .reduce((acc, val) => Math.max(acc, val));
  }

  // Returns the maximum number of speeches held by an argument group. Does not
  // count speeches without arguments.
  calculateSpeechesCount() {
    return this.argumentGroups.reduce(
      (accumulator, argumentGroup) => {
        // Find group length, ignoring speeches that are empty.
        let speechCount = argumentGroup.length
        while (speechCount > 0 && argumentGroup[speechCount - 1].length == 0) {
          speechCount -= 1
        }
        return Math.max(accumulator, speechCount)
      },
      0)
  }
}