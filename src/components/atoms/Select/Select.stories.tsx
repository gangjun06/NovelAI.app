import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Select as SelectUI } from "./Select";

export default {
  title: "Atoms/Select",
  component: SelectUI,
  argTypes: {},
} as ComponentMeta<typeof SelectUI>;

const SelectStory: ComponentStory<typeof SelectUI> = (args) => (
  <SelectUI {...args} />
);
export const Select = SelectStory.bind({});
Select.args = {
  defaultValue: 1,
  options: [
    {
      label: "First",
      value: 0,
    },
    {
      label: "Second",
      value: 1,
    },
    {
      label: "Third",
      value: 2,
    },
  ],
};
