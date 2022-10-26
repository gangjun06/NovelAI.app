import {
  ArchiveBoxIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { atom, useAtom } from "jotai";
import { useState } from "react";
import { Button } from "~/components/atoms";
import {
  archivedCategoryAtom,
  archivedCategoryAtomsAtom,
  CategoryAtom,
} from "~/components/organizm/TagTool/atoms";
import { useDisclosure } from "~/hooks/useDisclosure";
import { AddCategoryModal } from "./Modals/AddCategoryModal";
import { TagToolCategories } from "./Categories";

const focusAllAtom = atom(
  (get) => {
    const categories = get(archivedCategoryAtom);
    let isFocus = false;
    categories.forEach((data) => {
      if (data.isFocus) {
        isFocus = true;
      }
    });
    return isFocus;
  },
  (get, set) => {
    const isFocus = get(focusAllAtom);
    const atoms = get(archivedCategoryAtomsAtom);
    atoms.forEach((categoryAtom) => {
      set(categoryAtom, (prev) => ({ ...prev, isFocus: !isFocus }));
    });
  }
);

export const TagToolLibrary = () => {
  const [showAddModal, handleShowAddModal] = useDisclosure();
  const [targetAtom, setTargetAtom] = useState<CategoryAtom | null>(null);
  const [focusAll, setFocusAll] = useAtom(focusAllAtom);

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
      <div className="shadow-inner border-l border-base-color bg-[#fafafa] dark:bg-zinc-800 py-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-2xl text-title-color font-bold inline-flex gap-x items-center gap-x-2">
            <ArchiveBoxIcon className="h-6 w-6" />
            보관함
          </h2>
          <div className="flex gap-x-2">
            <Button onClick={handleShowAddModal.open} forIcon>
              <PlusIcon className="w-5 h-5" />
            </Button>
            <Button
              onClick={setFocusAll}
              forIcon
              variant={focusAll ? "primary" : "default"}
            >
              <CheckIcon className="w-5 h-5" />
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
