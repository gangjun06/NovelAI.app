import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import multer from 'multer'

import { getMiddlewares, handler } from '~/lib/api'
import { CloudflareStorage } from '~/lib/multer'

export const config = {
  api: {
    bodyParser: false,
  },
}

const upload = multer({
  storage: new CloudflareStorage(
    process.env.CLOUDFLARE_ACCOUNT_ID,
    process.env.CLOUDFLARE_API_TOKEN,
  ),
})

export default handler().post(
  ...getMiddlewares({ auth: 'USER' }),
  upload.single('file') as any,
  async (req, res) => {
    if (req.user.image) {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${req.user.image}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          },
        },
      )
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const path: string = req.file.path
    await prisma?.user.update({ where: { id: req.user.id }, data: { image: path } })
    res.json({})
    return
  },
)
