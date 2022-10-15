import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./Button";

export default {
  title: "Atoms/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "Button",
  variant: "primary",
};

export const Light = Template.bind({});
Light.args = {
  children: "Button",
  variant: "light",
};

export const Default = Template.bind({});
Default.args = {
  children: "Button",
  variant: "default",
};

export const Compact = Template.bind({});
Compact.args = {
  children: "Button",
  compact: true,
};

export const Subtle = Template.bind({});
Subtle.args = {
  children: "Button",
  variant: "subtle",
};
