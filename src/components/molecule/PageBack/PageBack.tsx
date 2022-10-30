import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { josa } from '@toss/hangul'

interface Props {
  label: string
  to: string
}

export const PageBack = ({ label, to }: Props) => {
  return (
    <Link href={to} passHref>
      <a className="flex gap-x-1.5 items-center text-description-color goBack hover:brightness-90">
        <ArrowLeftIcon className="w-5 h-5 arrow transform transition-transform" />
        <div>{`${josa(label, '으로/로')} 돌아가기`}</div>
      </a>
    </Link>
  )
}
