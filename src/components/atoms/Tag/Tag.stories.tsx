import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tag } from "./Tag";

export default {
  title: "Atoms/Tag",
  component: Tag,
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "This is a Tag",
};
