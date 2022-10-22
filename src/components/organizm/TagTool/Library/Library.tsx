import {
  ArchiveBoxIcon,
  ListBulletIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { Button } from "~/components/atoms";
import {
  archivedCategoryAtomsAtom,
  CategoryAtom,
  moveTagAtom,
} from "~/hooks/tagTool";
import { useDisclosure } from "~/hooks/useDisclosure";
import { AddCategoryModal } from "./Modals/AddCategoryModal";
import { CategoryView } from "./CategoryView";
import { OrderCategoryModal } from "./Modals/OrderCategoryModal";

export const TagToolLibrary = () => {
  const [categoryAtoms, handleCategoryAtoms] = useAtom(
    archivedCategoryAtomsAtom
  );
  const [showAddModal, handleShowAddModal] = useDisclosure();
  const [showOrderModal, handleShowOrderModal] = useDisclosure();
  const [targetAtom, setTargetAtom] = useState<CategoryAtom | null>(null);
  const movetag = useSetAtom(moveTagAtom);

  return (
    <>
      <AddCategoryModal
        show={showAddModal}
        onClose={() => {
          handleShowAddModal.close();
          setTargetAtom(null);
        }}
        editTargetAtom={targetAtom}
      />
      <OrderCategoryModal
        show={showOrderModal}
        onClose={handleShowOrderModal.close}
      />
      <div className="shadow-inner border-l border-base-color bg-[#fafafa] dark:bg-zinc-800 py-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-2xl text-title-color font-bold inline-flex gap-x items-center gap-x-2">
            <ArchiveBoxIcon className="h-6 w-6" />
            보관함
          </h2>
          <div className="flex gap-x-2">
            <Button onClick={handleShowAddModal.open} forIcon>
              <PlusIcon className="w-5 h-5" />
            </Button>
            <Button onClick={handleShowOrderModal.open} forIcon>
              <ListBulletIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={(result) => movetag(result)}>
          <div className="flex flex-col gap-3 overflow-y-scroll px-4 h-full">
            {categoryAtoms.map((categoryAtom) => (
              <CategoryView
                key={`${categoryAtom}`}
                categoryAtom={categoryAtom}
                rename={() => {
                  setTargetAtom(categoryAtom);
                  handleShowAddModal.open();
                }}
                duplicate={(value) => {
                  handleCategoryAtoms({
                    type: "insert",
                    value: { ...value, name: `${value.name}의 복사본` },
                  });
                }}
                remove={() => {
                  if (categoryAtoms.length < 2) {
                    toast.error(
                      "최소 한개 이상의 카테고리가 존재하여야 합니다."
                    );
                    return;
                  }
                  handleCategoryAtoms({ type: "remove", atom: categoryAtom });
                }}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </>
  );
};
