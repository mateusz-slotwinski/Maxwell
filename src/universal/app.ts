import 'zone.js/dist/zone-node'

import { ngExpressEngine } from '@nguniversal/express-engine'
import * as express from 'express'
import { join } from 'path'

import { AppServerModule } from '../main.server'
import { APP_BASE_HREF } from '@angular/common'
import { existsSync } from 'fs'

export function app(): express.Express {
  const server = express()
  const distFolder = join(process.cwd(), 'dist/maxwell/browser')
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index'

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule
    })
  )

  server.set('view engine', 'html')
  server.set('views', distFolder)

  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y'
    })
  )

  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    })
  })

  return server
}
