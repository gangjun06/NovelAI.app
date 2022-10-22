import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "~/components/atoms";
import { Modal } from "~/components/molecule";
import { archivedCategoryAtomsAtom, CategoryAtom } from "~/hooks/tagTool";

export const OrderCategoryModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const [categoryAtoms, handleCategoryAtoms] = useAtom(
    archivedCategoryAtomsAtom
  );

  return (
    <>
      <Modal show={show} onClose={onClose} closeBtn title="카테고리 순서">
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            console.log(source, destination);
            handleCategoryAtoms({
              type: "move",
              atom: categoryAtoms[source.index],
              before: categoryAtoms[destination?.index ?? 0],
            });
          }}
        >
          <Droppable droppableId="droppable">
            {(provider) => (
              <div
                {...provider.droppableProps}
                ref={provider.innerRef}
                className="overflow-y-auto"
              >
                <>
                  {categoryAtoms.map((categoryAtom, index) => (
                    <Item
                      key={`${categoryAtom}`}
                      categoryAtom={categoryAtom}
                      isTop={index === 0}
                      isBottom={categoryAtoms.length - 1 === index}
                      moveUp={() => {
                        handleCategoryAtoms({
                          type: "move",
                          atom: categoryAtom,
                          before: categoryAtoms[index - 1],
                        });
                      }}
                      moveDown={() => {
                        handleCategoryAtoms({
                          type: "move",
                          atom: categoryAtom,
                          before: categoryAtoms[index + 2],
                        });
                      }}
                    />
                  ))}
                  {provider.innerRef}
                </>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Modal>
    </>
  );
};

const Item = ({
  isTop,
  isBottom,
  categoryAtom,
  moveUp,
  moveDown,
}: {
  categoryAtom: CategoryAtom;
  moveUp: () => void;
  moveDown: () => void;
  isTop: boolean;
  isBottom: boolean;
}) => {
  const category = useAtomValue(categoryAtom);

  return (
    <div className="flex border-base-color border shadow-sm rounded-lg px-2 py-2 gap-x-1 text-subtitle-color bg-white dark:bg-zinc-800/50 mb-2 justify-between">
      <div>{category.name}</div>
      <div className="flex gap-x-1">
        <Button forIcon disabled={isTop} onClick={moveUp}>
          <ChevronUpIcon className="w-5 h-5" />
        </Button>
        <Button forIcon disabled={isBottom} onClick={moveDown}>
          <ChevronDownIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
