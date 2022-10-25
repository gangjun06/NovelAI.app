import {
  ArchiveBoxIcon,
  ListBulletIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/atoms";
import { CategoryAtom } from "~/components/organizm/TagTool/atoms";
import { useDisclosure } from "~/hooks/useDisclosure";
import { AddCategoryModal } from "./Modals/AddCategoryModal";
import { TagToolCategories } from "./Categories";

export const TagToolLibrary = () => {
  const [showAddModal, handleShowAddModal] = useDisclosure();
  const [targetAtom, setTargetAtom] = useState<CategoryAtom | null>(null);

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
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-scroll px-4 h-full">
          <TagToolCategories />
        </div>
      </div>
    </>
  );
};
