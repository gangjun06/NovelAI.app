import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { MainNav } from "./MainNav";

export default {
  title: "Organizm/Main/Nav",
  component: MainNav,
  argTypes: {},
} as ComponentMeta<typeof MainNav>;

const Template: ComponentStory<typeof MainNav> = (args) => (
  <MainNav {...args} />
);
export const Nav = Template.bind({});
Nav.args = {};
Nav.parameters = {
  nextRouter: {
    path: "/",
  },
};
