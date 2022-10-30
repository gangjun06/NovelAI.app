import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { UploadBlock as UI } from './UploadBlock'

export default {
  title: 'Molecule/UploadBlock',
  component: UI,
  argTypes: {},
} as ComponentMeta<typeof UI>

const Template: ComponentStory<typeof UI> = (args) => <UI {...args} />
export const UploadBlock = Template.bind({})
UploadBlock.args = {}
