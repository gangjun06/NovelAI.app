import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { UserMenu as UserMenuUI } from './UserMenu'

export default {
  title: 'molecule/UserMenu',
  component: UserMenuUI,
} as ComponentMeta<typeof UserMenuUI>

const UserMenuStory: ComponentStory<typeof UserMenuUI> = (args) => <UserMenuUI {...args} />

export const UserMenu = UserMenuStory.bind({})
UserMenu.args = {
  name: 'John Doe',
  email: 'me@example.com',
  image: 'https://via.placeholder.com/150',
}
