import { Injectable } from '@angular/core'

import { Mode } from 'app/mode.model'

// Application mode.
export class KeyCommand {
  // HTML key name.
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

export interface KeyMapping {
  // Action name.
  name: string

  // Keyboard shortcut.
  command: KeyCommand

  // Callback
  action: () => void
}

export type KeyMap = KeyMapping[];

@Injectable()
export class InputService {
  public keyMaps = new Map<Mode, KeyMap>([
    [Mode.command, []],
    [Mode.edit, []]
  ])

  // Maps keyboard shortcut.
  mapShortcut(mode: Mode, name: string, shortcut: string, action: () => void) {
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
      name,
      action,
      command: keyCommand
    })
  }

  keyPress(mode: Mode, event: KeyboardEvent) {
    let keyMap = this.getKeyMap(mode)

    let index = keyMap.findIndex(keyMapping => {
      return keyMapping.command.key == event.key.toLowerCase()
        && keyMapping.command.alt == event.altKey
        && keyMapping.command.control == event.ctrlKey
        && keyMapping.command.shift == event.shiftKey
        && keyMapping.command.super == event.metaKey
    })
    if (index == -1) return;

    event.preventDefault()
    keyMap[index].action()
  }

  private getKeyMap(mode: Mode) {
    let keyMap = this.keyMaps.get(mode)
    if (!keyMap) throw new Error("Unknown keymap for mode.")
    return keyMap
  }
}