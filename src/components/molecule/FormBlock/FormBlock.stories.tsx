import React from 'react'
import type { ComponentMeta } from '@storybook/react'

import { Input } from '~/components/atoms'

import { FormBlock as FormBlockUI } from './FormBlock'

export default {
  title: 'Molecule/FormBlock',
  component: FormBlockUI,
  argTypes: {},
} as ComponentMeta<any>

const Template = () => (
  <FormBlockUI label="Form Block">
    <Input />
  </FormBlockUI>
)

export const FormBlock = Template.bind({})
