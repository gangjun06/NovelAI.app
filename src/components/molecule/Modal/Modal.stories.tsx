import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Modal } from "./Modal";

export default {
  title: "Molecule/Modal",
  component: Modal,
  argTypes: {},
} as ComponentMeta<any>;

const Template: ComponentStory<typeof Modal> = (args) => (
  <Modal {...args}>
    lorem Fugit ut incidunt quas accusantium aut rem error laborum quia. Aut id
    iste blanditiis laboriosam libero. Est rerum numquam voluptatum. Repellendus
    laudantium consectetur repellat necessitatibus rem et. Esse modi facilis
    odio blanditiis. Ducimus id debitis exercitationem magni molestiae est
    possimus tempore voluptatem itaque et nihil. Qui iste saepe quod aut. Amet
    voluptatem itaque eligendi inventore saepe libero adipisci inventore beatae
    molestiae a. Maiores quam ut et in at.
  </Modal>
);
export const Default = Template.bind({});
Default.args = {
  show: true,
  closeBtn: true,
};

export const Title = Template.bind({});
Title.args = {
  show: true,
  closeBtn: true,
  title: "Demo modal",
};
