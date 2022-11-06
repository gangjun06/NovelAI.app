import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { MultiSelect as UI } from './MultiSelect'

export default {
  title: 'Atoms/MultiSelect',
  component: UI,
} as ComponentMeta<typeof UI>

const Template: ComponentStory<typeof UI> = (args) => <UI {...args} />

export const MultiSelect = Template.bind({})
MultiSelect.args = {}
