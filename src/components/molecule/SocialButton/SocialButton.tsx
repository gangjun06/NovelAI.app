import { forwardRef, ReactNode, useMemo } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

import { DiscordIcon, KakaoIcon, TwitterIcon } from './Icons'

interface DefaultProps {
  social: 'kakao' | 'discord' | 'twitter'
}

type ButtonProps = React.PropsWithoutRef<JSX.IntrinsicElements['button']> & DefaultProps

export const SocialButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, social, ...props }, ref) => {
    const btnClassName = useMemo(() => {
      return classNames(
        {
          'rounded-xl bg-[#FEE500] text-[#000000] text-opacity-[0.85] font-bold':
            social === 'kakao',
          'rounded-xl  bg-[#5865F2] text-white text-opacity-[0.85] font-bold': social === 'discord',
          'rounded-xl bg-[#1d9bf0] text-white font-bold': social === 'twitter',
        },
        'flex-none flex gap-x-2 items-center justify-center w-60 relative socialBtn hover:brightness-90 transition-all py-3',
        className,
      )
    }, [className, social])

    const text = useMemo(() => {
      if (social === 'kakao') return '카카오'
      else if (social === 'discord') return '디스코드'
      else if (social === 'twitter') return '트위터'
      return ''
    }, [social])

    const icon = useMemo(() => {
      if (social === 'kakao') return <KakaoIcon className="w-6 h-6 fill-black" />
      else if (social === 'discord') return <DiscordIcon className="w-6 h-6 fill-white" />
      else if (social === 'twitter') return <TwitterIcon className="w-6 h-6 fill-white" />
      return ''
    }, [social])

    return (
      <button ref={ref} {...props} className={btnClassName}>
        {icon}
        {`${text} 로그인`}
        <ArrowRightIcon className="arrow w-5 h-5 absolute right-6 translate-x-0 transition-transform transform" />
      </button>
    )
  },
)

SocialButton.displayName = 'SocialButton'
