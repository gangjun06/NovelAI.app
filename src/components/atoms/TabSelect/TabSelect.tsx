import classNames from 'classnames'

interface TabProps {
  selected: any
  list: { label: string; value: any }[]
  onChange: (value: any) => void
}

export const TabSelect = ({ selected, onChange, list }: TabProps) => {
  return (
    <div className="flex space-x-1.5 rounded-xl dark:bg-zinc-800 p-1.5 bg-gray-100">
      {list.map((item) => (
        <button
          onClick={() => onChange(item.value)}
          type="button"
          key={item.value}
          className={classNames(
            'w-full rounded-lg py-2.5',
            'focus:outline-none',
            item.value === selected
              ? 'bg-white dark:bg-white/[0.12] brightness-150 shadow dark:text-white font-bold'
              : 'text-gray-400 hover:text-gray-800 dark:hover:text-white',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
