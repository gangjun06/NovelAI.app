import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAtom, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import {
  ArchivedAtom,
  archivedCategoryAtomsAtom,
  CategoryAtom,
  moveTagAtom,
} from "~/components/organizm/TagTool/atoms";
import { coordinateGetter } from "~/utils/multipleContainersKeyboardCoordinates";
import { TagToolCategory } from "./Category";
import { TagToolTag } from "./Tag";

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export const TagToolCategories = () => {
  const [categoryAtoms, handleCategoryAtoms] = useAtom(
    archivedCategoryAtomsAtom
  );

  const [activeAtom, setActiveAtom] =
    useState<{
      type: "category" | "tag";
      data: CategoryAtom | ArchivedAtom;
    } | null>(null);

  const moveTag = useSetAtom(moveTagAtom);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const findActiveAtom = useAtomCallback(
    (get, _set, [activeId, categoryAtomName]: [string, string]) => {
      const categoryAtom = categoryAtoms.find(
        (atom) => `${atom}` === categoryAtomName
      );
      if (!categoryAtom) return;
      const tagAtom = get(categoryAtom).tags.find(
        (tagAtom) => `${tagAtom}` === activeId
      );
      setActiveAtom(tagAtom ? { type: "tag", data: tagAtom } : null);
    }
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        const containerId =
          (active.data.current?.sortable?.containerId as string) ?? "";

        if ((active.id as string).startsWith("container-")) {
          const categoryAtomName = (active.id as string).replace(
            "container-",
            ""
          );
          const data = categoryAtoms.find(
            (atom) => `${atom}` === categoryAtomName
          );
          console.log(data);
          setActiveAtom(data ? { type: "category", data } : null);
          return;
        }

        if (containerId.startsWith("category-")) {
          const categoryAtomName = containerId.replace("category-", "");
          findActiveAtom([active.id as string, categoryAtomName]);
        }
      }}
      onDragOver={(data) => {
        if ((data.active.id as string).startsWith("container-")) return;
        moveTag(data);
      }}
      onDragEnd={(data) => {
        if ((data.active.id as string).startsWith("container-")) moveTag(data);
        setActiveAtom(null);
      }}
      onDragCancel={() => {
        setActiveAtom(null);
      }}
    >
      <SortableContext
        items={categoryAtoms.map((categoryAtom) => `container-${categoryAtom}`)}
        strategy={verticalListSortingStrategy}
      >
        {categoryAtoms.map((categoryAtom) => (
          <TagToolCategory
            key={`${categoryAtom}`}
            categoryAtom={categoryAtom}
            duplicate={(value) => {
              handleCategoryAtoms({
                type: "insert",
                value: { ...value, name: `${value.name}의 복사본` },
              });
            }}
            remove={() => {
              if (categoryAtoms.length < 2) {
                toast.error("최소 한개 이상의 카테고리가 존재하여야 합니다.");
                return;
              }
              handleCategoryAtoms({ type: "remove", atom: categoryAtom });
            }}
          />
        ))}
      </SortableContext>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeAtom &&
            (activeAtom.type === "category" ? (
              <TagToolCategory categoryAtom={activeAtom.data as CategoryAtom} />
            ) : (
              <TagToolTag tagAtom={activeAtom.data as ArchivedAtom} />
            ))}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
