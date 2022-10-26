import React from 'react'
import { CogIcon } from '@heroicons/react/24/outline'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Button',
  variant: 'primary',
}

export const Light = Template.bind({})
Light.args = {
  children: 'Button',
  variant: 'light',
}

export const Default = Template.bind({})
Default.args = {
  children: 'Button',
  variant: 'default',
}

export const Compact = Template.bind({})
Compact.args = {
  children: 'Button',
  compact: true,
}

export const Subtle = Template.bind({})
Subtle.args = {
  children: 'Button',
  variant: 'subtle',
}

export const Icon = Template.bind({})
Icon.args = {
  children: <CogIcon width={24} height={24} />,
  variant: 'subtle',
  forIcon: true,
}
