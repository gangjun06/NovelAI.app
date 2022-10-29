import { ErrorProps } from 'next/error'

import { Button, ButtonLink } from '~/components/atoms'

function Error({ statusCode }: ErrorProps) {
  if (statusCode) {
    return (
      <p className="w-full bg-white dark:bg-zinc-800 flex flex-col items-center justify-center h-full">
        <div className="mb-1 font-bold text-xl text-title-color">
          {`${
            statusCode === 404 ? '페이지를 찾지 못하였습니다' : '서버에서 문제가 발생하였습니다'
          }`}
        </div>
        <ButtonLink href="/">홈으로 돌가가기</ButtonLink>
        <div className="text-description-color mt-2">
          만약 문제가 계속하여 발생한다면, <a href="mailto:me@gangjun.dev">me@gangjun.dev</a> 로
          문의하여 주세요
        </div>
      </p>
    )
  }

  return (
    <p className="w-full bg-white dark:bg-zinc-800 flex flex-col items-center justify-center h-full">
      <div className="mb-1 font-bold text-xl text-title-color">
        브라우저에서 에러가 발생하였어요
      </div>
      <Button
        onClick={() => {
          window.localStorage.clear()
          window.sessionStorage.clear()
          location.href = '/'
        }}
      >
        브라우저 데이터 지우고 다시 시도하기
      </Button>
      <div className="text-description-color mt-2">
        만약 문제가 계속하여 발생한다면, <a href="mailto:me@gangjun.dev">me@gangjun.dev</a> 로
        문의하여 주세요
      </div>
    </p>
  )
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
