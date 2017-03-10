import { Flow, Cursor, ArgumentGroup, Speech, Argument } from 'app/models/flow'

// Utility functions

function arg(contents = ''): Argument {
  return { contents: contents }
}

function speech(...arguments_: Array<Argument>) {
  return arguments_
}

function group(...speeches: Array<Speech>) {
  return speeches
}

function groupWithArgs(...arguments_: Array<Argument>): ArgumentGroup {
  return [arguments_]
}

// Helper constants

const arg1 = arg('arg1')
const arg2 = arg('arg2')
const arg3 = arg('arg3')

// Tests accessors
describe('Flow', () => {
  let flow: Flow
  beforeEach(() => {
    flow = new Flow()
  })

  // findArgument

  it('findArgument returns null for null argument', () => {
    expect(flow.findArgument(null)).toBeNull()
  })

  it('findArgument returns null for empty flow', () => {
    let arg = { contents: '' }
    expect(flow.findArgument(arg)).toBeNull()
  })

  it('findArgument finds argument in first speech', () => {
    flow.setArgumentGroups([groupWithArgs(arg1)])
    expect(flow.findArgument(arg1)).toEqual(new Cursor(0, 0, 0))
  })

  it('findArgument finds second argument in first speech', () => {
    flow.setArgumentGroups([groupWithArgs(arg1, arg2)])
    expect(flow.findArgument(arg2)).toEqual(new Cursor(0, 0, 1))
  })

  it('findArgument finds argument in second speech', () => {
    flow.setArgumentGroups([
      group(speech(), speech(arg1))
    ])
    expect(flow.findArgument(arg1)).toEqual(new Cursor(0, 1, 0))
  })

  it('findArgument finds argument in second group', () => {
    flow.setArgumentGroups([
      group(),
      group(speech(arg1))
    ])
    expect(flow.findArgument(arg1)).toEqual(new Cursor(1, 0, 0))
  })

  // countSpeeches (tested through setArgumentGroups)

  it('countSpeeches should not count empty speeches', () => {
    flow.setArgumentGroups([
      group(speech(), speech(arg1)),
      group(speech(), speech(), speech())
    ])

    expect(flow.speechesCount).toEqual(2)
  })

  // getArgument

  it('getArgument returns null for non-existent argument', () => {
    expect(flow.getArgument(0, 0, 0)).toBeNull()
  })

  it('getArgument returns an argument if it exists', () => {
    flow.setArgumentGroups([
      group(speech(), speech(arg1, arg2))
    ])
    expect(flow.getArgument(0, 1, 1)).toBe(arg2)
  })

  it('getArgument does not crash for out-of-bounds coordinates', () => {
    expect(flow.getArgument(4, 4, 4)).toBe(null)
  })

  // createArgument

  it('createArguent updates speech count', () => {
    flow.createArgument(arg1, false)
    expect(flow.speechesCount).toEqual(1)

    flow.moveCursor(0, 1, 0)
    flow.createArgument(arg2, false)
    expect(flow.speechesCount).toEqual(2)
  })

  // deleteArgumentAtCursor

  it('deleteArgumentAtCursor garbage collects excess speeches', () => {
    flow.setArgumentGroups([
      group(speech(arg1), speech(arg2), speech(arg3)),
      group(speech(), speech(), speech(), speech())
    ])

    flow.selectArgument(arg3)
    flow.deleteArgumentAtCursor()
    expect(flow.speechesCount).toEqual(2)
  })

  // moveCursor

  it('moveCursor throws error for invalid argument', () => {
    expect(() => flow.moveCursor(-1, 0, 0)).toThrow()
    expect(() => flow.moveCursor(0, -1, 0)).toThrow()
    expect(() => flow.moveCursor(0, 0, -1)).toThrow()
  })

  // moveArgument

  it('moveArgument recalculates speech count', () => {
    flow.createArgument(arg1, false)
    flow.moveArgument(1, 0)
    flow.moveArgument(1, 0)
    expect(flow.speechesCount).toEqual(3)
  })

  it('moveArgument should garbage collect speeches', () => {
    flow.setArgumentGroups([
      group(speech(), speech(arg1)),
      group(speech(), speech(), speech())
    ])

    // Remove speeches when there are two extra.
    flow.selectArgument(arg1)
    flow.moveArgument(-1, 0)
    expect(flow.speechesCount).toEqual(1)
    expect(flow.argumentGroups[0].length).toEqual(1)
    expect(flow.argumentGroups[1].length).toEqual(1)
  })

  it('moveArgument should not garbage collect speeches when moving middle arg', () => {
    flow.setArgumentGroups([
      group(speech(arg1), speech()),
      group()
    ])
    flow.speechesCount = 2

    flow.selectArgument(arg1)
    flow.moveArgument(0, 1)
    expect(flow.speechesCount).toEqual(2)
    expect(flow.argumentGroups[0].length).toEqual(2)
  })

  // select*

  it('selectUp/Down from empty argument group', () => {
    flow.setArgumentGroups([
      groupWithArgs(arg1),
      group(),
      groupWithArgs(arg2)
    ])
    flow.moveCursor(1, 0, 0)
    flow.selectDown()
    expect(flow.cursor).toEqual(new Cursor(2, 0, 0))
    expect(flow.selectedArgument).toBe(arg2)

    flow.moveCursor(1, 0, 0)
    flow.selectUp()
    expect(flow.cursor).toEqual(new Cursor(0, 0, 0))
    expect(flow.selectedArgument).toBe(arg1)
  })

  it('selectUp/Down from empty speech into empty speech', () => {
    flow.setArgumentGroups([
      group(speech()),
      group(speech()),
    ])

    flow.moveCursor(0, 0, 0)
    flow.selectDown()
    expect(flow.cursor).toEqual(new Cursor(1, 0, 0))
    expect(flow.selectedArgument).toBeNull()

    flow.moveCursor(1, 0, 0)
    flow.selectUp()
    expect(flow.cursor).toEqual(new Cursor(0, 0, 0))
    expect(flow.selectedArgument).toBeNull()
  })

  it('selectUp/Down into nonexistent speech', () => {
    flow.setArgumentGroups([
      group(),
      group()
    ])

    flow.moveCursor(0, 0, 0)
    flow.selectDown()
    expect(flow.cursor).toEqual(new Cursor(1, 0, 0))
    expect(flow.selectedArgument).toBeNull()

    flow.moveCursor(1, 0, 0)
    flow.selectUp()
    expect(flow.cursor).toEqual(new Cursor(0, 0, 0))
    expect(flow.selectedArgument).toBeNull()
  })


  it('selectLeft/Right from empty argument group', () => {
    flow.setArgumentGroups([group()])
    flow.selectRight()
    flow.selectLeft()
    expect(flow.cursor).toEqual(new Cursor(0, 0, 0))
  })

  it('selectLeft/Right into empty speech', () => {
    flow.setArgumentGroups([
      group(speech(), speech()),
      group(speech(), speech(arg1))  // Argument to prevent speech GC
    ])

    flow.moveCursor(0, 0, 0)
    flow.selectRight()
    expect(flow.cursor).toEqual(new Cursor(0, 1, 0))

    flow.moveCursor(0, 1, 0)
    flow.selectLeft()
    expect(flow.cursor).toEqual(new Cursor(0, 0, 0))
  })

  it('selectRight should select one past last argument', () => {
    flow.setArgumentGroups([
      group(speech(arg1))
    ])

    flow.selectArgument(arg1)
    flow.selectRight()
    expect(flow.cursor).toEqual(new Cursor(0, 1, 0))

    flow.selectRight()
    expect(flow.cursor).toEqual(new Cursor(0, 1, 0))
  })
})