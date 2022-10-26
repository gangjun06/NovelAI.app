import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { Switch as SwitchUI } from './Switch'

export default {
  title: 'Atoms/Switch',
  component: SwitchUI,
  argTypes: {},
} as ComponentMeta<typeof SwitchUI>

const SwitchStory: ComponentStory<typeof SwitchUI> = (args) => <SwitchUI {...args} />

export const Switch = SwitchStory.bind({})
SwitchStory.args = {
  label: 'Switch Label',
}
