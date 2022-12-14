import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { atom, Provider } from 'jotai'

import { Archived } from '~/components/organizm/TagTool/atoms'

import { TagToolTag } from './Tag'

export default {
  title: 'Organizm/TagTool/Library/Tag',
  component: TagToolTag,
  argTypes: {},
} as ComponentMeta<typeof TagToolTag>

const tagAtom = atom<Archived>({
  category: 'Category',
  name: 'Name',
  tag: 'TagContent',
  pinned: false,
  priority: 0,
})

const Template: ComponentStory<typeof TagToolTag> = (args) => {
  return (
    <Provider>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="temp">
          {(provider) => (
            <div {...provider.droppableProps} ref={provider.innerRef}>
              <TagToolTag {...args} tagAtom={tagAtom} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Provider>
  )
}
export const Tag = Template.bind({})
Tag.args = {}
