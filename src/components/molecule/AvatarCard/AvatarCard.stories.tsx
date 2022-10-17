import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { AvatarCard as AvatarCardUI } from "./AvatarCard";

export default {
  title: "Molecule/AvatarCard",
  component: AvatarCardUI,
  argTypes: {},
} as ComponentMeta<typeof AvatarCardUI>;

const Template: ComponentStory<typeof AvatarCardUI> = (args) => (
  <AvatarCardUI {...args} />
);

export const AvatarCard = Template.bind({});
AvatarCard.args = {
  avatarURL: "https://via.placeholder.com/150",
  name: "John Doe",
  description: "JohnDoe@example.com",
  buttonLink: "https://example.com",
  buttonText: "Send Message",
};
