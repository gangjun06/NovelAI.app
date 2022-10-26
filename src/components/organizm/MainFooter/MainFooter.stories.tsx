import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { MainFooter } from './MainFooter'

export default {
  title: 'Organizm/Main/Footer',
  component: MainFooter,
  argTypes: {},
} as ComponentMeta<typeof MainFooter>

const Template: ComponentStory<typeof MainFooter> = (_args) => <MainFooter />
export const Footer = Template.bind({})
Footer.args = {}
Footer.parameters = {
  nextRouter: {
    path: '/',
  },
}
