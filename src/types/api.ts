import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { z, ZodType } from 'zod'

export interface DefaultRequest<
  T extends ZodType<any, any, any>['_output'],
  U extends ZodType<any, any, any>['_output'] = {
    [key: string]: string | string[]
  },
> extends NextApiRequest {
  user: Session['user']
  data: T
  queryData: U
}

export type DefaultResponse<T = any> = NextApiResponse<T | { msg: string; errors?: z.ZodIssue[] }>
