import React from 'react'
import { SessionProvider } from 'next-auth/react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { MainNav } from './MainNav'

export default {
  title: 'Organizm/Main/Nav',
  component: MainNav,
  argTypes: {},
} as ComponentMeta<typeof MainNav>

const NotLoggedInStory: ComponentStory<typeof MainNav> = () => (
  <SessionProvider>
    <MainNav />
  </SessionProvider>
)
export const NotLoggedIn = NotLoggedInStory.bind({})
NotLoggedIn.args = {}
NotLoggedIn.parameters = {
  nextRouter: {
    path: '/',
  },
}

const LoggedInStory: ComponentStory<typeof MainNav> = () => (
  <SessionProvider
    session={{
      expires: '',
      user: {
        email: 'me@example.com',
        name: 'John Doe',
        image: 'https://via.placeholder.com/150',
      },
    }}
  >
    <MainNav />
  </SessionProvider>
)
export const LoggedIn = LoggedInStory.bind({})
LoggedIn.args = {}
LoggedIn.parameters = {
  nextRouter: {
    path: '/',
  },
}
