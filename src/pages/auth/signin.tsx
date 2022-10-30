import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

import { SocialButton } from '~/components/molecule'
import { MainTemplate } from '~/components/template'
import { loadRedirect } from '~/lib/auth.client'

const SignIn: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      toast.error(router.query.error as string)
    }
  }, [router.query])

  useEffect(() => {
    if (status === 'authenticated') {
      toast.success('성공적으로 로그인 되었습니다')
      router.push(loadRedirect())
    }
  }, [router, status])

  return (
    <MainTemplate
      title="로그인 / 회원가입"
      description="NovelAI.APP에 로그인합니다"
      container
      tiny
      showTitle={false}
    >
      <div className="flex items-center justify-center h-full max-w-4xl mx-auto">
        <div className="-mt-20">
          <div className="text-center text-title-color text-4xl font-bold mb-1">로그인</div>
          <div className="text-description-color mb-6">
            소셜 계정으로 로그인하여 다양한 기능을 사용하세요!
          </div>
          <div className="flex flex-col gap-y-2.5 items-center">
            <SocialButton social="kakao" onClick={() => signIn('kakao')} />
            <SocialButton social="discord" onClick={() => signIn('discord')} />
            <SocialButton social="twitter" onClick={() => signIn('twitter')} />
          </div>
        </div>
      </div>
    </MainTemplate>
  )
}

export default SignIn
