import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSetAtom } from 'jotai'

import { Input } from '~/components/atoms'
import { FormBlock, Modal } from '~/components/molecule'
import { archivedCategoryAtomsAtom } from '~/components/organizm/TagTool/atoms'

export const AddCategoryModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  const [name, setName] = useState<string>('')
  const handleArchivedCategoryAtoms = useSetAtom(archivedCategoryAtomsAtom)

  const handleSubmit = () => {
    const value = name.trim()
    if (value === '') {
      toast.error('이름을 입력하여 주세요')
      return false
    }
    handleArchivedCategoryAtoms({
      type: 'insert',
      value: {
        name: value,
        tags: [],
        isFocus: true,
        isOpen: true,
      },
    })
    toast.success('카테로리를 생성하였습니다')
    return true
  }

  return (
    <>
      <Modal
        onCancel={onClose}
        onClose={onClose}
        onSubmit={handleSubmit}
        show={show}
        submitBtn={'생성'}
        title="보관함 카테고리 생성"
      >
        <FormBlock label="이름">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormBlock>
      </Modal>
    </>
  )
}
