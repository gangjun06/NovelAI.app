import { Disclosure } from "@headlessui/react";
import { ArchiveBoxIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { Button, Tag } from "~/components/atoms";
import { Menu } from "~/components/molecule";
import { archivedCategoryAtomsAtom } from "~/hooks/tagTool";
import { useDisclosure } from "~/hooks/useDisclosure";
import { AddCategoryModal } from "./AddCategoryModal";
import { CategoryView } from "./CategoryView";

export const Sidebar = () => {
  const [categoryAtoms, handleCategoryAtoms] = useAtom(
    archivedCategoryAtomsAtom
  );
  const [showAddModal, handleShowAddModal] = useDisclosure();

  return (
    <>
      <AddCategoryModal
        show={showAddModal}
        onClose={handleShowAddModal.close}
      />
      <div className="shadow-inner border-l border-base-color bg-[#fafafa] dark:bg-zinc-800 px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-title-color font-bold inline-flex gap-x items-center gap-x-2">
            <ArchiveBoxIcon className="h-6 w-6" />
            보관함
          </h2>
          <Button onClick={handleShowAddModal.open}>카테고리 추가</Button>
        </div>

        <div className="flex flex-col gap-3">
          {categoryAtoms.map((categoryAtom) => (
            <CategoryView
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
        </div>
      </div>
    </>
  );
};
