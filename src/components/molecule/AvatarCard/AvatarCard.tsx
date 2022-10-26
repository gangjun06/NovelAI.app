import Image from 'next/image'
import classNames from 'classnames'

import { ButtonLink } from '~/components/atoms'

interface Props {
  avatarURL?: string
  name: string
  description: string
  buttonText: string
  buttonLink: string
}

export const AvatarCard = ({ avatarURL, name, description, buttonText, buttonLink }: Props) => {
  return (
    <div
      className={classNames(
        'border-base-color border items-center rounded px-6 py-4 flex flex-col gap-y-2 bg-white dark:bg-zinc-700/50',
        !avatarURL && 'justify-center',
      )}
    >
      {avatarURL && (
        <div>
          <Image src={avatarURL} width={64} height={64} alt="avatar image" />
        </div>
      )}
      <div className="text-center">
        <div className="text-subtitle-color font-bold text-xl">{name}</div>
        <div className="text-description-color">{description}</div>
      </div>
      <ButtonLink className="w-full" href={buttonLink}>
        {buttonText}
      </ButtonLink>
    </div>
  )
}
