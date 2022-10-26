import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { Provider } from 'jotai'

import { defaultSetting, settingAtom } from '~/hooks/useSetting'

import { SettingModal as SettingModalUI, showModalAtom } from './SettingModal'

export default {
  title: 'Organizm/SettingModal',
  component: SettingModalUI,
  argTypes: {},
} as ComponentMeta<typeof SettingModalUI>

const Template: ComponentStory<typeof SettingModalUI> = () => (
  <Provider
    initialValues={[
      [showModalAtom, true],
      [settingAtom, defaultSetting],
    ]}
  >
    <SettingModalUI />
  </Provider>
)
export const SettingModal = Template.bind({})
SettingModal.args = {}
