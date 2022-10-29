import { ErrorProps } from 'next/error'

import { Button } from '~/components/atoms'
import { ErrorPage } from '~/components/organizm/ErrorPage/ErrorPage'

function Error({ statusCode }: ErrorProps) {
  if (statusCode) {
    return (
      <ErrorPage
        title={`${
          statusCode === 404 ? '페이지를 찾지 못하였습니다' : '서버에서 문제가 발생하였습니다'
        }`}
        gotoHome
      />
    )
  }

  return (
    <ErrorPage title="브라우저에서 에러가 발생하였어요">
      <Button
        onClick={() => {
          window.localStorage.clear()
          window.sessionStorage.clear()
          location.href = '/'
        }}
      >
        브라우저 데이터 지우고 다시 시도하기
      </Button>
    </ErrorPage>
  )
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
