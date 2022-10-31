import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Input } from './Input'

export default {
  title: 'Atoms/Input',
  component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {
  max: 30,
  label: 'Hello',
  value: '1234567890123456789012345678901',
}
