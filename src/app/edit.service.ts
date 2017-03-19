// View-model for editing arguments.
import { Cursor, Argument } from 'app/flow.model'

export class EditService {
  // Editing coordinates
  iArgumentGroup = -1
  iSpeech = -1
  iArgument = -1
  text = ''

  startEditing(cursor: Cursor, text) {
    this.iArgumentGroup = cursor.iArgumentGroup
    this.iSpeech = cursor.iSpeech
    this.iArgument = cursor.iArgument
    this.text = text
  }

  // Set argument coordinates to sentinel values.
  stopEditing() {
    this.iArgumentGroup = -1
    this.iSpeech = -1
    this.iArgument = -1
  }

  isEditing(iArgumentGroup, iSpeech, iArgument) {
    return this.iArgumentGroup == iArgumentGroup
      && this.iSpeech == iSpeech
      && this.iArgument == iArgument
  }
  
  createArgument(): Argument {
    return { contents: this.text }
  }
}