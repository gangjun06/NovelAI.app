import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Textarea as UI } from './Textarea'

export default {
  title: 'Atoms/Textarea',
  component: UI,
} as ComponentMeta<typeof UI>

const Template: ComponentStory<typeof UI> = (args) => <UI {...args} />

export const Textarea = Template.bind({})
Textarea.args = {}
