import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { TrashIcon, ClipboardIcon } from "@heroicons/react/24/outline";

import { FormBlock as FormBlockUI } from "./FormBlock";
import { Button, Input } from "~/components/atoms";

export default {
  title: "Molecule/FormBlock",
  component: FormBlockUI,
  argTypes: {},
} as ComponentMeta<any>;

const Template = () => (
  <FormBlockUI label="Form Block">
    <Input />
  </FormBlockUI>
);

export const FormBlock = Template.bind({});
