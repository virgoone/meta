import type { NextApiRequest, NextApiResponse } from 'next'
import got from 'got'

const metaScraper = require('metascraper')([
  require('metascraper-audio')(),
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-media-provider')(),
  require('metascraper-title')(),
  require('metascraper-video')(),
  require('metascraper-clearbit')()
])

type Data = {
  [key: string]: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const url = decodeURIComponent(req.query.url as string)

  try {
    require('url').parse(url)
  } catch (err) {
    res.status(400)
    res.json({ error: 'Invalid URL' })
    return
  }

  const { body: html, url: metaURL } = await got(url)
  const metadata = await metaScraper({ html, url: metaURL })

  res.json(metadata)
}
