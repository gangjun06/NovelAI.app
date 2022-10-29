import { useRouter } from 'next/router'

import { ButtonLink } from '~/components/atoms'
import { ErrorPage } from '~/components/organizm/ErrorPage/ErrorPage'

const AuthError = () => {
  const { query } = useRouter()

  return (
    <ErrorPage title="로그인중 에러가 발생하였습니다">
      <div className="text-description-color">{query?.error ?? ''}</div>
      <ButtonLink href="/auth/signin">로그인으로 이동하기</ButtonLink>
    </ErrorPage>
  )
}

export default AuthError
