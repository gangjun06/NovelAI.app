import { NextApiRequest } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { Middleware } from 'next-connect'
import { authOptions } from '~/pages/api/auth/[...nextauth]'

import { UserRole } from '@prisma/client'

import { DefaultRequest, DefaultResponse } from '~/types/api'

export const auth = (userRole: UserRole) => {
  const func: Middleware<DefaultRequest<any>, DefaultResponse> = async (req, res, next) => {
    const session = await unstable_getServerSession(req as NextApiRequest, res, authOptions)

    const unauthorization = () => {
      res.status(401).json({ msg: 'Authentication failed' })
    }

    if (!session || !session.user) return unauthorization()
    req.user = session.user

    if (session.user.role === UserRole.ADMIN) {
      return next()
    }

    if (userRole !== session.user.role) {
      return unauthorization()
    }

    next()
  }
  return func
}

export const setRedirect = () => {
  localStorage.setItem('auth-redirect-to', location.pathname + location.search)
}
export const loadRedirect = () => {
  const to = localStorage.getItem('auth-redirect-to') ?? ''
  localStorage.removeItem('auth-redirect-to')
  return to
}
