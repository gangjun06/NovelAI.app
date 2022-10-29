import React, { Fragment, ReactNode } from 'react'
import { Menu as MenuUI, Transition } from '@headlessui/react'
import classNames from 'classnames'

interface Props {
  children: ReactNode
}

export const Menu = ({ children }: Props) => {
  return (
    <MenuUI as="div" className="relative inline-block text-left">
      {children}
    </MenuUI>
  )
}

const Button = ({ children }: { children: ReactNode }) => {
  return <MenuUI.Button as={React.Fragment}>{children}</MenuUI.Button>
}

const Dropdown = ({
  children,
  direction = 'bottom-start',
}: {
  children: ReactNode
  direction?: 'bottom-start' | 'bottom-end'
}) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <MenuUI.Items
        className={classNames(
          'absolute mt-2 w-56 divide-y divide-gray-100 rounded-md bg-white dark:bg-zinc-700/90 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[1]',
          {
            'left-0 origin-top-right': direction === 'bottom-start',
            'right-0 origin-top-left': direction === 'bottom-end',
          },
        )}
      >
        <div className="px-1 py-1">{children}</div>
      </MenuUI.Items>
    </Transition>
  )
}

interface ItemProps {
  icon?: (props: React.PropsWithoutRef<JSX.IntrinsicElements['svg']>) => JSX.Element
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
}

const Item = ({ icon: Icon, onClick, children, disabled = false }: ItemProps) => {
  return (
    <MenuUI.Item>
      {({ active }) => (
        <button
          disabled={disabled}
          onClick={onClick}
          className={`${
            active && !disabled ? 'bg-primary-500 text-white' : 'text-subtitle-color'
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          {Icon ? <Icon className="mr-2 h-5 w-5 text-primary-400" aria-hidden="true" /> : null}
          {children}
        </button>
      )}
    </MenuUI.Item>
  )
}

const ItemNoButton = ({ icon: Icon, onClick: _onClick, children, disabled = false }: ItemProps) => {
  return (
    <div
      className={`${
        !disabled ? 'hover:bg-primary-500 hover:text-white' : 'text-subtitle-color'
      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
    >
      {Icon ? <Icon className="mr-2 h-5 w-5 text-primary-400" aria-hidden="true" /> : null}
      {children}
    </div>
  )
}

Menu.Button = Button
Menu.Dropdown = Dropdown
Menu.Item = Item
Menu.ItemNoButton = ItemNoButton
