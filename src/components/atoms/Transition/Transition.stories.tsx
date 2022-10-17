import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Transition as TransitionUI } from "./Transition";

export default {
  title: "Atoms/Transition",
  component: TransitionUI,
} as ComponentMeta<typeof TransitionUI>;

export const Transition: ComponentStory<typeof TransitionUI> = (args) => (
  <TransitionUI {...args}>
    <div className="bg-gray-300/50 px-2 py-2">
      Fugit ut incidunt quas accusantium aut rem error laborum quia. Aut id iste
      blanditiis laboriosam libero. Est rerum numquam voluptatum. Repellendus
      laudantium consectetur repellat necessitatibus rem et. Esse modi facilis
      odio blanditiis. Ducimus id debitis exercitationem magni molestiae est
      possimus tempore voluptatem itaque et nihil. Qui iste saepe quod aut. Amet
      voluptatem itaque eligendi inventore saepe libero adipisci inventore
      beatae molestiae a. Maiores quam ut et in at.
    </div>
  </TransitionUI>
);

Transition.args = {
  show: true,
};
