import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { MultiSelectContent as UI } from './Content'

export default {
  title: 'Atoms/MultiSelect',
  component: UI,
} as ComponentMeta<typeof UI>

const Template: ComponentStory<typeof UI> = (args) => {
  const [values, setValues] = useState<string[]>([])

  return <UI {...args} values={values} onChange={(data) => setValues(data)} />
}

export const MultiSelect = Template.bind({})
MultiSelect.args = {}
