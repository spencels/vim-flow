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
describe('Flow - accessors', () => {
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
})

describe('Flow', () => {
  let flow: Flow
  beforeEach(() => {
    flow = new Flow()
  })

  // moveCursor

})