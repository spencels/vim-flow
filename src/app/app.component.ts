import { Component } from '@angular/core';

import { FlowService, Argument } from 'app/services/flow'
import { EditService } from 'app/services/edit'

type KeyMap = { [key: string]: () => void }

// Application mode.
enum Mode {
  Command,
  Edit,
  Select
}

@Component({
  selector: 'app-root',
  template: `
    <app-flow 
      [flow]="flow"
      [editModel]="editModel"
      (selectArgument)="selectArgument($event)"
      (selectSpeech)="selectSpeech($event)"
      (editText)="editText($event)"
      (window:keypress)="keyPress($event)">
    </app-flow>
  `,
})
export class AppComponent {
  // Models
  commandKeyMap: KeyMap = {}
  editKeyMap: KeyMap = {}
  mode: Mode = Mode.Command

  constructor(private flow: FlowService, private editModel: EditService) {
    // Map keyboard shortcuts
    let moveArgument = (x, y) => this.flow.moveArgument(x, y)

    this.mapShortcut(Mode.Command, 'j', this.flow.selectDown.bind(this.flow))
    this.mapShortcut(Mode.Command, 'k', this.flow.selectUp.bind(this.flow))
    this.mapShortcut(Mode.Command, 'l', this.flow.selectRight.bind(this.flow))
    this.mapShortcut(Mode.Command, 'h', this.flow.selectLeft.bind(this.flow))
    this.mapShortcut(Mode.Command, 'J', () => moveArgument(0, 1))
    this.mapShortcut(Mode.Command, 'K', () => moveArgument(0, -1))
    this.mapShortcut(Mode.Command, 'L', () => moveArgument(1, 0))
    this.mapShortcut(Mode.Command, 'H', () => moveArgument(-1, 0))
    this.mapShortcut(Mode.Command, 'n', () => this.createArgument(false))
    this.mapShortcut(Mode.Command, 'N', () => this.createArgument(true))
    this.mapShortcut(
      Mode.Command, 'd', this.flow.deleteArgumentAtCursor.bind(this.flow))
    this.mapShortcut(
      Mode.Command, 'e', () => this.editArgument())
    this.mapShortcut(
      Mode.Command, 's', () => this.editArgument(true))

    this.mapShortcut(Mode.Edit, 'Enter', () => this.stopEditing())
  }

  // Maps keyboard shortcut.
  mapShortcut(mode, key, action) {
    switch (mode) {
      case Mode.Command:
        this.commandKeyMap[key] = action
        break
      case Mode.Edit:
        this.editKeyMap[key] = action
      default:
        break
    }
  }

  // Selects argument by reference.
  selectArgument(argument: Argument) {
    this.flow.selectArgument(argument);
  }

  // Selects speech. Argument in form of [iArgumentGroup, iSpeech].
  selectSpeech(speechCoordinate: Array<number>) {
    const [ iArgumentGroup, iSpeech ] = speechCoordinate
    this.flow.selectSpeech(iArgumentGroup, iSpeech)
  }

  keyPress(event: KeyboardEvent) {
    switch (this.mode) {
      case Mode.Command: {
        if (!(event.key in this.commandKeyMap)) return;
        event.preventDefault()
        this.commandKeyMap[event.key]()
        break
      }
      case Mode.Edit: {
        if (!(event.key in this.editKeyMap)) return;
        event.preventDefault()
        this.editKeyMap[event.key]()
      }
      default:
        break
    }
  }

  createArgument(newGroup: boolean) {
    const argument = this.flow.createArgument(
        { contents: '' }, newGroup)
    this.editArgument(false)
  }

  editArgument(overwriteContents: boolean = false) {
    if (!this.flow.selectedArgument) return;
    this.mode = Mode.Edit
    this.editModel.startEditing(
      this.flow.cursor,
      overwriteContents ? '' :  this.flow.selectedArgument.contents)
  }

  stopEditing() {
    this.mode = Mode.Command
    const argument = { contents: this.editModel.text }
    this.flow.putArgument(argument)
    this.editModel.stopEditing()
  }

  editText(text) {
    this.editModel.text = text
  }
}
