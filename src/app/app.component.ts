import { Component, OnInit, HostListener } from '@angular/core';

import * as flow from 'app/models/flow'

type KeyMap = { [key: string]: () => void }

enum Mode {
  kNavigation,
  kEditingMode
}

@Component({
  selector: 'app-root',
  template: `
    <app-flow 
      [flow]="flow"
      (selectArgument)="selectArgument($event)"
      (selectSpeech)="selectSpeech($event)"
      (window:keypress)="keyPress($event)">
    </app-flow>
  `,
})
export class AppComponent extends OnInit {
  title = 'app works!';
  flow = new flow.Flow();
  navigationKeyMap: KeyMap = {}
  mode: Mode = Mode.kNavigation

  ngOnInit() {
    // Map keyboard shortcuts
    this.mapShortcut(Mode.kNavigation, 'j', this.flow.selectDown.bind(this.flow))
    this.mapShortcut(Mode.kNavigation, 'k', this.flow.selectUp.bind(this.flow))
    this.mapShortcut(Mode.kNavigation, 'l', this.flow.selectRight.bind(this.flow))
    this.mapShortcut(Mode.kNavigation, 'h', this.flow.selectLeft.bind(this.flow))
    this.mapShortcut(Mode.kNavigation, 'n', () => this.createArgument(false))
    this.mapShortcut(Mode.kNavigation, 'N', () => this.createArgument(true))
    this.mapShortcut(
      Mode.kNavigation, 'd', this.flow.deleteArgumentAtCursor.bind(this.flow))

    // Add some default data.
    this.flow.argumentGroups = [
      [
        [
          { contents: "Arg1" },
          { contents: "Arg2" }
        ],
        [
          { contents: "Arg1Speech2"}
        ]
      ],
      [
        [
          { contents: "Arg1" },
          { contents: "Arg2" }
        ]
      ]
    ]
  }

  // Maps keyboard shortcut.
  mapShortcut(mode, key, action) {
    switch (mode) {
      case Mode.kNavigation:
        this.navigationKeyMap[key] = action
        break
      default:
        throw `Unrecognized mode ${mode}`
    }
  }

  // Selects argument by reference.
  selectArgument(argument: flow.Argument) {
    this.flow.selectArgument(argument);
  }

  // Selects speech. Argument in form of [iArgumentGroup, iSpeech].
  selectSpeech(speechCoordinate: Array<number>) {
    const [ iArgumentGroup, iSpeech ] = speechCoordinate
    this.flow.selectSpeech(iArgumentGroup, iSpeech)
  }

  // @HostListener('keypress', ['$event'])
  keyPress(event: KeyboardEvent) {
    switch (this.mode) {
      case Mode.kNavigation: {
        if (!(event.key in this.navigationKeyMap)) return;
        this.navigationKeyMap[event.key]()
      }
      default:
        break
    }
  }

  argumentCounter = 0

  createArgument(newGroup: boolean) {
    this.flow.createArgument(
      { contents: `New arg ${this.argumentCounter}` }, newGroup)
  }
}
