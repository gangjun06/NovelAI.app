import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { MainNav } from "./MainNav";

export default {
  title: "Organizm/MainNav",
  component: MainNav,
  argTypes: {},
} as ComponentMeta<typeof MainNav>;

const Template: ComponentStory<typeof MainNav> = (args) => (
  <MainNav {...args} />
);
export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  nextRouter: {
    path: "/",
  },
};
