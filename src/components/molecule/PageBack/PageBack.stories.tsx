import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { PageBack as UI } from './PageBack'

export default {
  title: 'Molecule/PageBack',
  component: UI,
  argTypes: {},
} as ComponentMeta<typeof UI>

const Template: ComponentStory<typeof UI> = (args) => <UI {...args} />
export const PageBack = Template.bind({})
PageBack.args = {
  label: '갤러리',
  to: '/gallery',
}
