import { collectionsURL } from '~/assets/urls'
import { Button, Input } from '~/components/atoms'
import { Form, Modal } from '~/components/molecule'
import { collectionPostValidator } from '~/types/collection'

interface Props {
  show: boolean
  onClose: () => void
}

export const CollectionCreateModalContent = ({ show, onClose }: Props) => {
  return (
    <Modal.Root show={show} onClose={onClose}>
      <Form schema={collectionPostValidator} url={collectionsURL}>
        {({ register }) => (
          <Modal.Panel
            onClose={onClose}
            title="컬렉션 만들기"
            buttons={
              <>
                <Button type="button" onClick={onClose}>
                  취소
                </Button>
                <Button variant="primary" type="submit">
                  만들기
                </Button>
              </>
            }
          >
            <Input
              {...register('name')}
              label="이름"
              placeholder="만들고 싶은 컬렉션의 이름을 입력해주세요..."
            />
          </Modal.Panel>
        )}
      </Form>
    </Modal.Root>
  )
}
