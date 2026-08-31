import type { Plugin, ViteDevServer } from 'vite'

/**
 * Lets `pnpm dev` serve api/*.ts directly (via Vite's own TS transform) so
 * VITE_CANDIDATE_SOURCE=api works without the Vercel CLI / an account login.
 * Vercel's own bundler handles api/* independently in production — this
 * plugin only exists for local development.
 */
export function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-functions',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        const url = new URL(req.url, 'http://localhost')
        const routeName = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '')
        const modulePath = `/api/${routeName}.ts`

        try {
          const mod = await server.ssrLoadModule(modulePath)
          const handler = mod.default
          if (typeof handler !== 'function') {
            next()
            return
          }

          const query = Object.fromEntries(url.searchParams.entries())
          const mockRes = {
            statusCode: 200,
            status(code: number) {
              this.statusCode = code
              return this
            },
            setHeader(name: string, value: string) {
              res.setHeader(name, value)
              return this
            },
            json(payload: unknown) {
              res.statusCode = this.statusCode
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
            },
          }

          await handler({ method: req.method, query }, mockRes)
        } catch (err) {
          next(err instanceof Error ? err : new Error(String(err)))
        }
      })
    },
  }
}
