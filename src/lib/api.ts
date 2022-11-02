import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect, { Middleware, Options } from 'next-connect'
import { UserRole } from '@prisma/client'
import { NotFoundError } from '@prisma/client/runtime'
import superjson from 'superjson'
import { z } from 'zod'

import { DefaultRequest, DefaultResponse } from '~/types/api'

import { auth } from './auth'

export class BadRequestError extends Error {
  constructor(message?: string | undefined) {
    super(message)
  }
}
export class UnauthorizedError extends Error {
  constructor(message?: string | undefined) {
    super(message)
  }
}

export const getAPIQuery = (req: NextApiRequest, res: NextApiResponse, name: string) => {
  const data = req.query[name]
  if (typeof data !== 'string') {
    res.status(400).json({ msg: 'Bad Request' })
    return null
  }
  return data
}

type parserSchemaType = z.ZodEffects<any> | z.ZodObject<any>

export const parser = <T extends parserSchemaType, U = any>(schema: T) => {
  const func: Middleware<DefaultRequest<z.infer<T>>, DefaultResponse<U>> = async (
    req,
    res,
    next,
  ) => {
    console.log(req.url)
    console.log(req.body)
    const parsed = await schema.safeParseAsync(req.body)
    if (!parsed.success) {
      res.status(400).json({
        msg: 'Bad Request',
        errors: parsed.error.errors,
      })
      return
    }
    req.data = parsed.data
    next()
  }
  return func
}

export const parseQuery = <T extends parserSchemaType, U>(schema: T) => {
  const func: Middleware<DefaultRequest<z.infer<T>>, DefaultResponse<U>> = async (
    req,
    res,
    next,
  ) => {
    const parsed = await schema.safeParseAsync(req.query)
    if (!parsed.success) {
      res.status(400).json({ msg: 'Bad Request' })
      return
    }
    req.queryData = parsed.data
    next()
  }
  return func
}

export const nextConnectOptions: Options<DefaultRequest<z.TypeOf<any>>, DefaultResponse> = {
  onError: (err, _req, res, _next) => {
    if (err instanceof NotFoundError) {
      res.status(404).json({ msg: 'Not Found!' })
    } else if (err instanceof BadRequestError) {
      res.status(400).json({ msg: err.message ?? 'Bad Request' })
    } else if (err instanceof UnauthorizedError) {
      res.status(401).json({ msg: err.message ?? 'Bad Request' })
    } else {
      console.log(err)
      res.status(500).end('Something broke!')
    }
  },
  onNoMatch: (_req, res) => {
    res.status(404).end('Page is not found')
  },
}

interface HandlerOptions<T extends parserSchemaType, U extends parserSchemaType, Res = any> {
  schema?: T
  options?: any
  auth?: UserRole | null
  query?: U
  skip?: boolean
  res?: Res
}

export const defaultHandlerOptions: HandlerOptions<any, any> = {
  options: nextConnectOptions,
  auth: UserRole.USER,
  skip: true,
}

export const handler = <T extends parserSchemaType, U extends parserSchemaType>(
  options?: HandlerOptions<T, U>,
) => {
  const handler = nextConnect(options?.options ?? defaultHandlerOptions.options)

  if (options?.skip !== true) {
    const middlewares = getMiddlewares(options)
    if (middlewares.length) {
      handler.use(...middlewares)
    }
  }

  return handler
}

export const getMiddlewares = <T extends parserSchemaType, U extends parserSchemaType, Res>(
  options?: HandlerOptions<T, U, Res>,
) => {
  let {
    // eslint-disable-next-line prefer-const
    schema = null,
    auth: useAuth,
    // eslint-disable-next-line prefer-const
    query = defaultHandlerOptions.query,
  } = options || {}

  if (useAuth === undefined) {
    useAuth = defaultHandlerOptions.auth
  }

  const result = []

  if (useAuth) result.push(auth<Res>(useAuth))
  if (query) result.push(parseQuery<U, Res>(query))
  if (schema) result.push(parser<T, Res>(schema))

  return result
}
