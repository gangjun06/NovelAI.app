import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { SocialButton as SocialButtonUI } from './SocialButton'

export default {
  title: 'Molecule/SocialButton',
  component: SocialButtonUI,
} as ComponentMeta<typeof SocialButtonUI>

const Template: ComponentStory<typeof SocialButtonUI> = (args) => <SocialButtonUI {...args} />

export const SocialButton = Template.bind({})
SocialButton.args = {
  social: 'kakao',
}
