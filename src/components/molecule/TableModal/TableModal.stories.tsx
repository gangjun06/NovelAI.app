import React from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { TableModal as UI } from './TableModal'

export default {
  title: 'Molecule/TableModal',
  component: UI,
  argTypes: {},
} as ComponentMeta<typeof UI>

const Template: ComponentStory<typeof UI> = (args) => <UI {...args} />
export const TableModal = Template.bind({})
TableModal.args = {
  show: true,
  headData: ['이름', '내용'],
  bodyData: [
    ['enim', 'Cum Vel Ex'],
    ['ipsum', 'Rerum ut dolorem et officia.'],
    [
      'voluptatem',
      'Quia enim dolores sequi soluta aut placeat modi optio ut architecto ab id facilis et. ',
    ],
    [
      'dolores',
      'Delectus quia consectetur voluptatem repudiandae corporis veritatis voluptate ut.',
    ],
    [
      'quia',
      'Quis tempora consequuntur molestiae rerum dolorem et voluptate necessitatibus at inventore ducimus est. ',
    ],
    ['omnis', 'corporis id recusandae.'],
  ],
}
