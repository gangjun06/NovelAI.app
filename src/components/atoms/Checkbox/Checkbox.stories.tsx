import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Checkbox as CheckboxUI } from "./Checkbox";

export default {
  title: "Atoms/Checkbox",
  component: CheckboxUI,
  argTypes: {},
} as ComponentMeta<typeof CheckboxUI>;

const CheckboxStory: ComponentStory<typeof CheckboxUI> = (args) => (
  <CheckboxUI {...args} />
);
export const Checkbox = CheckboxStory.bind({});
Checkbox.args = {
  label: "Checkbox",
};
