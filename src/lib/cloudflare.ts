import axios, { AxiosError } from 'axios'
import FormData from 'form-data'

interface CloudflareDirectImageRes {
  result: {
    uploadURL: string
    id: string
  }
}

export const getImagesDirectURL = async (count: number) => {
  const result: CloudflareDirectImageRes['result'][] = []

  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + 30)

  for (let i = 0; i < count; i++) {
    const formData = new FormData()
    formData.append('requireSignedURLs', 'false')
    formData.append('expiry', expiry.toISOString())

    try {
      const res = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          },
        },
      )
      if (res.status !== 200) throw new Error('request failed')
      console.log(res.data)
      result.push((res.data as CloudflareDirectImageRes).result)
    } catch (e) {}
  }

  return result
}
