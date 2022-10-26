import React from 'react'
import { ClipboardIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { ComponentMeta } from '@storybook/react'

import { Button } from '~/components/atoms'

import { Menu as MenuUI } from './Menu'

export default {
  title: 'Molecule/Menu',
  component: MenuUI,
  argTypes: {},
} as ComponentMeta<any>

const Template = () => (
  <MenuUI>
    <MenuUI.Button>
      <Button>Menu Button</Button>
    </MenuUI.Button>
    <MenuUI.Dropdown>
      <MenuUI.Item icon={TrashIcon}>Delete</MenuUI.Item>
      <MenuUI.Item icon={ClipboardIcon}>Copy</MenuUI.Item>
    </MenuUI.Dropdown>
  </MenuUI>
)

export const Menu = Template.bind({})
