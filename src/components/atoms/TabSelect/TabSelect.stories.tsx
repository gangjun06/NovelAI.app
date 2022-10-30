import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { TabSelect as UI } from './TabSelect'

export default {
  title: 'Atoms/TabSelect',
  component: UI,
  argTypes: {},
} as ComponentMeta<typeof UI>

const Template: ComponentStory<typeof UI> = (args) => <UI {...args} />
export const TabSelect = Template.bind({})
TabSelect.args = {
  list: [
    { label: 'Hello', value: 1 },
    { label: 'World', value: 2 },
  ],
  selected: 1,
}
