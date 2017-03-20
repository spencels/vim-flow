import { Injectable } from '@angular/core'

@Injectable()
export class DownloadService {
  // Downloads file with name `filename` and contents `data`. `data` should be a
  // string.
  // http://stackoverflow.com/a/18197341
  download(data: string, fileName: string | null = null) {
    let element = document.createElement('a')
    element.setAttribute(
        'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
    element.setAttribute('download', fileName || 'flow.vf')

    element.style.display = 'none'
    document.body.appendChild(element)

    // Download
    try {
      element.click()
    } finally {
      document.body.removeChild(element)
    }
  }
}