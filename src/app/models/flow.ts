// Flow data structures and operations.
import { createCheckedArray } from 'app/util/checkedArray'

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
  public static readonly EMPTY = new Cursor(-1, 0, 0)
}

export class Flow {
  // Outer list is speeches, inner list is arguments.
  argumentGroups: ArgumentGroup[] = createCheckedArray([[]])

  // Coordinates of selected argument.
  cursor: Cursor = new Cursor(0, 0, 0)

  // Selected argument, or null if no argument is present at coordinates.
  selectedArgument: Argument | null = null;

  // Number of speeches. This is used to determine how far right the cursor can
  // move.
  speechesCount: number = 0

  // Non-mutating methods

  // Returns cursor for argument, or null if it is not in the flow.
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

  // Gets argument at coordinates, or null if it doesn't exist.
  getArgument(iArgumentGroup: number, iSpeech: number, iArgument: number) {
    if (iArgumentGroup < 0) {
      throw new Error(`iArgumentGroup negative (${iArgumentGroup}`)
    } else if (iSpeech < 0) {
      throw new Error(`iSpeech negative (${iSpeech}`)
    } else if (iArgument < 0) {
      throw new Error(`iArgument negative (${iArgument}`)
    }

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

  getSpeechAtCursor() {
    return this.getSpeech(this.cursor.iArgumentGroup, this.cursor.iSpeech)
  }

  // Mutation methods

  // TEST ONLY - Replaces argument groups
  setArgumentGroups(argumentGroups: ArgumentGroup[]) {
    this.argumentGroups = createCheckedArray(argumentGroups)
    this.moveCursor(0, 0, 0)
    this.speechesCount = this.countSpeeches()
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
    return this.selectedArgument
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

  // Moves cursor to speech at given coordinates.
  selectSpeech(iArgumentGroup, iSpeech) {
    this.moveCursor(iArgumentGroup, iSpeech, 0)
  }

  // Moves cursor down to next argument.
  selectDown() {
    // If nothing selected, select first argument.
    if (this.trySetDefaultCursor()) return;

    const { iArgumentGroup, iSpeech, iArgument } = this.cursor
    const speech = this.getSpeech(iArgumentGroup, iSpeech)
    if (speech) {
      if (iArgument + 1 < speech.length) {
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
    const nextSpeech = this.getOrCreateSpeech(iNextArgumentGroup, iSpeech)
    const iNextArgument = nextSpeech.length > 0 ? nextSpeech.length - 1 : 0
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
    const iNewArgument = newSpeech && newSpeech.length > 0
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

  // Move argument at cursor to new speech. 
  moveArgument(x: number, y: number) {
    const iNewArgumentGroup = this.cursor.iArgumentGroup + y
    const iNewSpeech = this.cursor.iSpeech + x

    // Ignore invalid moves.
    if (iNewArgumentGroup < 0 || iNewSpeech < 0) return;

    const oldSpeech = this.getSpeechAtCursor()
    const [argument] = oldSpeech.splice(this.cursor.iArgument)

    const argumentGroup = this.getOrCreateArgumentGroup(iNewArgumentGroup)
    const speech = this.getOrCreateSpeech(iNewArgumentGroup, iNewSpeech)
    speech.push(argument)
    const iOldSpeech = this.cursor.iSpeech
    this.selectArgument(argument)

    // Update speeches count if modifying the last speech.
    if (iOldSpeech + 1 == this.speechesCount) {
      this.updateSpeechCount()
    }
  }

  // Rearrange argument within a speech. Positive "direction" is down, negative
  // is up.
  moveArgumentInSpeech(direction: number) {
    // TODO
  }

  // Finds (argumentGroup, speech, argument) index tuple for the given argument.
  // Returns null if not found.
  deleteArgumentAtCursor() {
    if (this.selectedArgument == null) return;  // TODO: throw error

    let { iArgumentGroup, iSpeech, iArgument } = this.cursor

    this.argumentGroups[iArgumentGroup][iSpeech].splice(iArgument, 1);

    // If argument was the last argument in the last speech, recalculate speeches
    // Update speeches count if modifying the last speech.
    if (iSpeech + 1 == this.speechesCount) {
      this.updateSpeechCount()
    }

    // Replace cursor
    let speech = this.getSpeech(iArgumentGroup, iSpeech)
    let iNewSpeech, iNewArgument
    if (speech) {
      // Select argument below the deleted, unless it doesn't exist.
      iNewSpeech = iSpeech
      if (speech.length == 0) {
        iArgument = 0
      } else if (speech.length == iArgument) {
        // If the last in the last was deleted, select new end of list.
        iNewArgument = speech.length - 1
      } else {
        // Else select the argument below.
        iNewArgument = iArgument
      }
    } else {
      // Select last speech + 1
      iNewArgument = 0
      iNewSpeech = this.argumentGroups[iArgumentGroup].length
    }

    this.moveCursor(iArgumentGroup, iNewSpeech, iNewArgument)
  }

  // Replaces existing argument at cursor with the provided one.
  putArgument(argument: Argument) {
    this.getSpeechAtCursor()[this.cursor.iArgument] = argument
    this.selectArgument(argument)
  }

  // Places a new argument at cursor and moves cursor to it. If `newGroup` is
  // true, creates a new argumentGroup.
  createArgument(argument: Argument, newGroup: boolean) {
    // Don't do anything if cursor is empty.
    if (this.cursor == Cursor.EMPTY) return;

    // Find or create speech.
    let speech: Speech
    let iInsertArgumentAt
    if (newGroup) {
      const iNewArgumentGroup = this.cursor.iArgumentGroup + 1
      const newArgumentGroup = this.getOrCreateArgumentGroup(iNewArgumentGroup)
      speech = this.getOrCreateSpeech(iNewArgumentGroup, this.cursor.iSpeech)
      iInsertArgumentAt = 0
    } else {
      speech = this.getSpeechAtCursor()
      if (speech) {
        iInsertArgumentAt = this.cursor.iArgument + 1
      } else {
        speech = this.getOrCreateSpeech(
          this.cursor.iArgumentGroup, this.cursor.iSpeech)
        iInsertArgumentAt = 0
      }
    }
    speech.splice(iInsertArgumentAt, 0, argument)

    if (this.cursor.iSpeech + 1 >= this.speechesCount) {
      this.updateSpeechCount()
    }

    // Set cursor to new argument.
    return this.selectArgument(argument)  // TODO: Use moveCursor for performance
  }

  // Private methods

  private deleteArgumentGroupIfEmpty(iArgumentGroup: number) {
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

  // Returns the maximum number of speeches held by an argument group. Does not
  // count speeches without arguments.
  private countSpeeches() {
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

  // Updates speech count and prunes extra speeches if necessary.
  private updateSpeechCount() {
    const oldSpeechesCount = this.speechesCount
    this.speechesCount = this.countSpeeches()
    if (this.speechesCount >= oldSpeechesCount) return

    // Recalculate speech count and prune empty speeches.
    for (let argumentGroup of this.argumentGroups) {
      if (argumentGroup.length > this.speechesCount) {
        argumentGroup.splice(
          this.speechesCount, argumentGroup.length - this.speechesCount)
      }
    }
  }

  private getOrCreateArgumentGroup(iArgumentGroup) {
    for (let i = this.argumentGroups.length; i < iArgumentGroup + 1; i++) {
      this.argumentGroups.push([])
    }
    return this.argumentGroups[iArgumentGroup]
  }

  // Creates speech only, not argument group.
private getOrCreateSpeech(iArgumentGroup, iSpeech) {
    const argumentGroup = this.argumentGroups[iArgumentGroup]
    for (let i = argumentGroup.length; i <= iSpeech; i++) {
      argumentGroup.push([])
    }
    return argumentGroup[iSpeech]
  }

  // Places cursor in the default location, if cursor is not already set.
  // Returns true if cursor was set, or if cursor cannot be set.
  private trySetDefaultCursor() {
    if (this.cursor !== Cursor.EMPTY) return false;

    this.moveCursor(0, 0, 0)
    return this.cursor !== Cursor.EMPTY
  }
}