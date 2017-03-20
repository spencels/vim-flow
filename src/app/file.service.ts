import { Injectable } from '@angular/core'

import { FlowService } from 'app/flow.service'
import { DownloadService } from 'app/download.service'

// Latest file format version.
const CURRENT_FILE_VERSION = 1

@Injectable()
export class FileService {
  flowName: string = null

  constructor(
      private flow: FlowService, private downloadService: DownloadService) {

  }

  newFlow() {
    this.flow.reset()
    this.flowName = null
  }

  load(file: File) {
    if ('name' in file && !file.name.endsWith('.vf')) {
      throw new Error('Invalid file type.')
    }
    this.flowName = file.name
    let reader = new FileReader()
    reader.onloadend = (event) => {
      let data = JSON.parse(reader.result)
      if (data.version != CURRENT_FILE_VERSION) {
        throw new Error(`File version ${data.version} not recognized.`)
      }
      this.flow.setArgumentGroups(data.data.groups)
    }

    reader.readAsText(file)
  }

  // Save file by downloading it.
  save() {
    // Convert to file.
    const fileData = JSON.stringify({
      version: CURRENT_FILE_VERSION,
      data: {
        groups: this.flow.argumentGroups
      }
    })

    this.downloadService.download(fileData, null)
  }
}