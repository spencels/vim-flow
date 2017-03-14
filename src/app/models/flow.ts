// Data structures representing the flow.

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
