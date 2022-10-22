import { atom, SetStateAction, useAtom, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "~/components/atoms";
import { FormBlock, Modal } from "~/components/molecule";
import { archivedCategoryAtomsAtom, CategoryAtom } from "~/hooks/tagTool";

export const AddCategoryModal = ({
  show,
  onClose,
  editTargetAtom,
}: {
  show: boolean;
  editTargetAtom?: CategoryAtom | null;
  onClose: () => void;
}) => {
  const [name, setName] = useState<string>("");
  const handleArchivedCategoryAtoms = useSetAtom(archivedCategoryAtomsAtom);
  const [editTarget, setEditTarget] = useAtom(
    useMemo(() => editTargetAtom ?? atom(null), [editTargetAtom])
  );

  useEffect(() => {
    if (editTarget?.name) setName(editTarget.name);
  }, [editTarget?.name]);

  const handleSubmit = () => {
    const value = name.trim();
    if (value === "") {
      toast.error("이름을 입력하여 주세요");
      return false;
    }
    if (!editTarget || !editTarget) {
      handleArchivedCategoryAtoms({
        type: "insert",
        value: { name: value, tags: [], isFocus: true },
      });
      toast.success("카테로리를 생성하였습니다");
      return true;
    }
    //@ts-ignore
    setEditTarget((prev) => ({ ...prev, name: value }));
    toast.success("카테로리 이름을 수정하였습니다");
    return true;
  };

  return (
    <>
      <Modal
        onCancel={onClose}
        onClose={onClose}
        onSubmit={handleSubmit}
        show={show}
        submitBtn={editTarget ? "수정" : "생성"}
        title="보관함 카테고리 생성"
      >
        <FormBlock label="이름">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormBlock>
      </Modal>
    </>
  );
};
