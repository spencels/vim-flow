import { Component } from '@angular/core';

import { FlowService, Argument } from 'app/services/flow'
import { EditService } from 'app/services/edit'


// Application mode.
enum Mode {
  Command,
  Edit,
  Select
}

class KeyCommand {
  // HTML key name
  key: string

  // Windows key or Command key.
  super = false

  // Alt or Option key.
  alt = false

  // Control key.
  control = false

  // Either shift key.
  shift = false

  toString() {
    let keys = []
    if (this.super) keys.push('super')
    if (this.control) keys.push('ctrl')
    if (this.alt) keys.push('alt')
    if (this.shift) keys.push('shift')
    keys.push(this.key)
    return keys.join('-')
  }
}

interface KeyMapping {
  command: KeyCommand
  action: () => void
}

type KeyMap = KeyMapping[]

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
  commandKeyMap: KeyMap = []
  editKeyMap: KeyMap = []
  mode: Mode = Mode.Command

  constructor(private flow: FlowService, private editModel: EditService) {
    // Map keyboard shortcuts
    let moveArgument = (x, y) => this.flow.moveArgument(x, y)
    let moveArgumentInSpeech = x => this.flow.moveArgumentInSpeech(x)

    this.mapShortcut(Mode.Command, 'j', this.flow.selectDown.bind(this.flow))
    this.mapShortcut(Mode.Command, 'k', this.flow.selectUp.bind(this.flow))
    this.mapShortcut(Mode.Command, 'l', this.flow.selectRight.bind(this.flow))
    this.mapShortcut(Mode.Command, 'h', this.flow.selectLeft.bind(this.flow))
    this.mapShortcut(Mode.Command, 'J', () => moveArgument(0, 1))
    this.mapShortcut(Mode.Command, 'K', () => moveArgument(0, -1))
    this.mapShortcut(Mode.Command, 'L', () => moveArgument(1, 0))
    this.mapShortcut(Mode.Command, 'H', () => moveArgument(-1, 0))
    this.mapShortcut(Mode.Command, 'ctrl-j', () => moveArgumentInSpeech(1))
    this.mapShortcut(Mode.Command, 'ctrl-k', () => moveArgumentInSpeech(-1))
    this.mapShortcut(Mode.Command, 'g', this.flow.selectTop.bind(this.flow))
    this.mapShortcut(Mode.Command, 'G', this.flow.selectBottom.bind(this.flow))
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
  mapShortcut(mode: Mode, shortcut: string, action: () => void) {
    // Parse shortcut
    let keyCommand = new KeyCommand()
    for (let button of shortcut.split('-')) {
      switch (button.toLowerCase()) {
        case 'ctrl':
          keyCommand.control = true
          break
        case 'alt':
          keyCommand.alt = true
          break
        case 'shift':
          keyCommand.shift = true
          break
        case 'super':
          keyCommand.super = true
          break
        default:
          keyCommand.key = button.toLowerCase()
          if (button === button.toUpperCase()) keyCommand.shift = true
      }
    }

    // Check uniqueness and push
    let keyMap = this.getKeyMap(mode)
    if (keyMap.findIndex(x => x.command === keyCommand) != -1) {
      console.warn('Duplicate action bound for ', keyCommand.toString())
      return
    }
    keyMap.push({
      command: keyCommand,
      action: action
    })
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

  private getKeyMap(mode = this.mode) {
    switch (mode) {
      case Mode.Command:
        return this.commandKeyMap
      case Mode.Edit:
        return this.editKeyMap
      default:
        throw "Unrecognized mode."
    }

  }

  keyPress(event: KeyboardEvent) {
    let keyMap = this.getKeyMap()

    let index = keyMap.findIndex(keyMapping => {
      return keyMapping.command.key == event.key.toLowerCase()
        && keyMapping.command.alt == event.altKey
        && keyMapping.command.control == event.ctrlKey
        && keyMapping.command.shift == event.shiftKey
        && keyMapping.command.super == event.metaKey
    })
    console.log(event)
    if (index == -1) return;

    event.preventDefault()
    keyMap[index].action()
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
