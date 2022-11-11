import { Controller } from 'react-hook-form'
import { CollectionVisibility } from '@prisma/client'

import { collectionsURL } from '~/assets/urls'
import { Button, FormBlock, Input, TabSelect, Textarea } from '~/components/atoms'
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
        {({ registerForm, control, watch }) => (
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
            <div className="flex flex-col gap-y-3">
              <Input
                {...registerForm('name')}
                label="이름"
                placeholder="만들고 싶은 컬렉션의 이름을 입력해주세요..."
              />
              <Textarea
                {...registerForm('description')}
                label="설명"
                placeholder="컬렉션에 대한 설명을 입력해주세요..."
              />
              <FormBlock label="공개 범위 설정">
                <Controller
                  control={control}
                  name="status"
                  defaultValue={CollectionVisibility.PUBLIC}
                  render={({ field }) => (
                    <TabSelect
                      onChange={(changed) => field.onChange(changed)}
                      selected={field.value}
                      list={[
                        {
                          label: '공개',
                          value: CollectionVisibility.PUBLIC,
                        },
                        {
                          label: '일부공개',
                          value: CollectionVisibility.UNLISTED,
                        },
                        {
                          label: '비공개',
                          value: CollectionVisibility.PRIVATE,
                        },
                      ]}
                    />
                  )}
                />
                <div className="mt-1 text-description-color">
                  {watch('status') === CollectionVisibility.PUBLIC
                    ? '모든 사용자가 볼 수 있어요.'
                    : watch('status') === CollectionVisibility.UNLISTED
                    ? '프로필에 표시되지 않고 링크로만 볼 수 있어요.'
                    : '나만 볼 수 있어요.'}
                </div>
              </FormBlock>
            </div>
          </Modal.Panel>
        )}
      </Form>
    </Modal.Root>
  )
}
