// Original Source Code: https://github.com/zaida04/multer-cloudflare-storage

import type { Request } from 'express'
import FormData from 'form-data'
import type { StorageEngine } from 'multer'
import multer from 'multer'
import fetch from 'node-fetch'

export interface CloudflareCDNUploadResponse<T = string[]> {
  success: boolean
  errors: {
    code: number
    message: string
  }[]
  result: {
    id: string
    filename: string
    metadata: {
      meta: string
    }
    requireSignedURLs: boolean
    variants: T
    uploaded: string
  }
}

class CloudflareStorage implements StorageEngine {
  private destURL: string
  public constructor(private accountID: string, private accountToken: string) {
    if (!accountID || typeof accountID !== 'string')
      throw new Error('You must specify a proper accountID belonging to your cloudflare account.')
    if (!accountToken || typeof accountToken !== 'string')
      throw new Error('You must specify a proper account token.')
    this.destURL = `https://api.cloudflare.com/client/v4/accounts/${this.accountID}/images/v1`
  }

  public _handleFile(
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, info?: Partial<Express.Multer.File>) => void,
  ): void {
    const body = new FormData()
    body.append('file', file.stream)
    void fetch(this.destURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accountToken}`,
        ...body.getHeaders(),
      },
      body,
    }).then((response) => {
      void (response.json() as Promise<CloudflareCDNUploadResponse>).then((data) => {
        if (response.ok)
          return callback(null, {
            path: data.result.variants[0],
            filename: data.result.filename,
            destination: data.result.id,
          })
        return callback(new Error('There was an error in uploading an asset to Cloudflare Images.'))
      })
    })
  }

  public _removeFile(
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): void {
    void fetch(`${this.destURL}/${file.destination}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.accountToken}`,
      },
    }).then((response) => {
      if (response.ok) return callback(null)
      return callback(new Error('There was an error in deleting the asset from Cloudflare Images.'))
    })
  }
}

export { CloudflareStorage }
export default CloudflareStorage
