import { Component } from '@angular/core';

import { FlowService, Argument } from 'app/services/flow'
import { EditService } from 'app/services/edit'
import { InputService } from 'app/services/input'
import { Mode } from 'app/models/mode'

@Component({
  selector: 'app-root',
  template: `
    <app-flow 
      [flow]="flow"
      [editModel]="editModel"
      (selectArgument)="flow.selectArgument($event)"
      (selectSpeech)="selectSpeech($event)"
      (editText)="editText($event)"
      (window:keypress)="keyPress($event)">
    </app-flow>
  `,
})
export class AppComponent {
  // Models
  mode: Mode = Mode.command

  constructor(
      private flow: FlowService, private editModel: EditService,
      private input: InputService) {
    // Map keyboard shortcuts
    let moveArgument = (x, y) => this.flow.moveArgument(x, y)
    let moveArgumentInSpeech = x => this.flow.moveArgumentInSpeech(x)

    this.input.mapShortcut(Mode.command, 'j', () => this.flow.selectDown())
    this.input.mapShortcut(Mode.command, 'k', () => this.flow.selectUp())
    this.input.mapShortcut(Mode.command, 'l', () => this.flow.selectRight())
    this.input.mapShortcut(Mode.command, 'h', () => this.flow.selectLeft())
    this.input.mapShortcut(Mode.command, 'J', () => moveArgument(0, 1))
    this.input.mapShortcut(Mode.command, 'K', () => moveArgument(0, -1))
    this.input.mapShortcut(Mode.command, 'L', () => moveArgument(1, 0))
    this.input.mapShortcut(Mode.command, 'H', () => moveArgument(-1, 0))
    this.input.mapShortcut(
      Mode.command, 'ctrl-j', () => moveArgumentInSpeech(1))
    this.input.mapShortcut(
      Mode.command, 'ctrl-k', () => moveArgumentInSpeech(-1))
    this.input.mapShortcut(Mode.command, 'g', () => this.flow.selectTop())
    this.input.mapShortcut(Mode.command, 'G', () => this.flow.selectBottom())
    this.input.mapShortcut(Mode.command, 'n', () => this.createArgument(false))
    this.input.mapShortcut(Mode.command, 'N', () => this.createArgument(true))
    this.input.mapShortcut(
      Mode.command, 'd', () => this.flow.deleteArgumentAtCursor())
    this.input.mapShortcut(
      Mode.command, 'e', () => this.editArgument())
    this.input.mapShortcut(
      Mode.command, 's', () => this.editArgument(true))

    this.input.mapShortcut(Mode.edit, 'Enter', () => this.stopEditing())
  }

  keyPress(event) {
    this.input.keyPress(this.mode, event)
  }

  // Selects argument by reference.
  selectArgument(argument: Argument) {
    this.flow.selectArgument(argument);
  }

  // Selects speech. Argument in form of [iArgumentGroup, iSpeech].
  selectSpeech(speechCoordinate: [number, number]) {
    const [ iArgumentGroup, iSpeech ] = speechCoordinate
    this.flow.selectSpeech(iArgumentGroup, iSpeech)
  }

  createArgument(newGroup: boolean) {
    const argument = this.flow.createArgument(
        { contents: '' }, newGroup)
    this.editArgument(false)
  }

  editArgument(overwriteContents: boolean = false) {
    if (!this.flow.selectedArgument) return;
    this.mode = Mode.edit
    this.editModel.startEditing(
      this.flow.cursor,
      overwriteContents ? '' :  this.flow.selectedArgument.contents)
  }

  stopEditing() {
    this.mode = Mode.command
    const argument = { contents: this.editModel.text }
    this.flow.putArgument(argument)
    this.editModel.stopEditing()
  }

  editText(text) {
    this.editModel.text = text
  }
}
