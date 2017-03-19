import { Component } from '@angular/core';

import { FlowService } from 'app/flow.service'
import { EditService } from 'app/edit.service'
import { InputService } from 'app/input.service'
import { Mode } from 'app/mode.model'
import { Argument } from 'app/flow.model'

@Component({
  selector: 'app-root',
  template: `
    <div id="appContainer">
      <app-inputs-panel id="inputsPanel" [activeMode]="mode"
          [ngClass]="{'hidden': !input.panelVisible}">
      </app-inputs-panel>
      <div id="appFlowContainer">
        <app-flow 
          id="appFlow"
          [flow]="flow"
          [editModel]="editModel"
          (selectArgument)="flow.selectArgument($event)"
          (selectSpeech)="selectSpeech($event)"
          (editText)="editText($event)"
          (window:keypress)="keyPress($event)">
        </app-flow>
      </div>
    </div>
  `,

  styles: [`
    #appContainer {
      position: fixed;
      width: 100%;
      height: 100%;
      padding: 0px;

      box-sizing: border-box;
      top: 0;
      left: 0;
    }

    #appFlowContainer {
      width: auto;
      height: 100%;
      background-color: #DDDDDD;

      box-sizing: border-box;
      padding: 5px;

      /* Triggers block formatting context, which allows shortcut panel to be
         fixed to the right. */
      overflow: scroll;
    }

    #inputsPanel {
      width: 300px;
      height: 100%;
      float: right;

      background-color: white;
    }

    .hidden {
      display: none;
    }
  `]
})
export class AppComponent {
  // Models
  mode: Mode = Mode.command

  constructor(
      private flow: FlowService, private editModel: EditService,
      private input: InputService) {
    // Map keyboard shortcuts
    const commandKeyMap: [string, string, () => void][] = [
      ['New argument', 'n', () => this.createArgument(false)],
      ['New argument and create new group', 'N',
       () => this.createArgument(true)],
      ['Delete argument', 'd', () => this.flow.deleteArgumentAtCursor()],
      ['Delete row', 'D', () => this.flow.deleteArgumentGroupAtCursor()],
      ['Edit argument', 'e', () => this.editArgument()],
      ['Replace argument (overwrite)', 's', () => this.editArgument(true)],
      ['Move cursor down', 'j', () => this.flow.selectDown()],
      ['Move cursor up', 'k', () => this.flow.selectUp()],
      ['Move cursor right', 'l', () => this.flow.selectRight()],
      ['Move cursor left', 'h', () => this.flow.selectLeft()],
      ['Move cursor to top', 'g', () => this.flow.selectTop()],
      ['Move cursor to bottom', 'G', () => this.flow.selectBottom()],
      ['Move cursor to next row', 'J', () => this.flow.skipGroup(1)],
      ['Move cursor to previous row', 'K', () => this.flow.skipGroup(-1)],
      ['Move argument to row - down', 'ctrl-j',
       () => this.flow.moveArgument(0, 1)],
      ['Move argument to row - up', 'ctrl-k',
       () => this.flow.moveArgument(0, -1)],
      ['Move argument to row - right', 'ctrl-l',
       () => this.flow.moveArgument(1, 0)],
      ['Move argument to row - left', 'ctrl-h',
       () => this.flow.moveArgument(-1, 0)],
      ['Move argument within row - down', 'ctrl-j',
       () => this.flow.moveArgumentInSpeech(1)],
      ['Move argument within row - up', 'ctrl-k',
       () => this.flow.moveArgumentInSpeech(-1)],
      ['Hide shortcuts panel', '?', () => this.input.togglePanel()]
    ]

    const editKeyMap: [string, string, () => void][] = [
      ['Finish editing', 'Enter', () => this.stopEditing()]
    ]

    for (let [name, shortcut, action] of commandKeyMap) {
      this.input.mapShortcut(Mode.command, name, shortcut, action)
    }
    for (let [name, shortcut, action] of editKeyMap) {
      this.input.mapShortcut(Mode.edit, name, shortcut, action)
    }
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
