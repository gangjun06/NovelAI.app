import { atom, useAtom } from 'jotai'

import { Select, Switch, FormBlock } from '~/components/atoms'
import { Modal } from '~/components/molecule'
import { settingAtom, Theme, themeAtom } from '~/hooks/useSetting'

export const showModalAtom = atom(false)

export const SettingModal = () => {
  const [show, setShow] = useAtom(showModalAtom)
  const [setting, setSetting] = useAtom(settingAtom)
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <>
      <Modal show={show} title="설정" closeBtn onClose={() => setShow(false)}>
        <div className="flex flex-col gap-4">
          <Select
            label="테마"
            defaultValue={theme}
            onChange={(value) => setTheme(value as Theme)}
            options={[
              { label: '라이트 모드', value: 'light' },
              { label: '다크 모드', value: 'dark' },
              { label: '시스템 설정', value: 'system' },
            ]}
          />
          <Select
            label="테마"
            defaultValue={setting.priorityChar}
            onChange={(value) =>
              setSetting((prev) => ({
                ...prev,
                priorityChar: value as any,
              }))
            }
            options={[
              { label: '{ 태그 } [NovelAI.net]', value: '{' },
              { label: '( 태그 ) [WEB UI]', value: '(' },
            ]}
          />
          <FormBlock label="태그 생성기">
            <Switch
              label="NSFW"
              checked={setting.useNSFW}
              onChange={(useNSFW) => setSetting((prev) => ({ ...prev, useNSFW }))}
            />
            <Switch
              label="복사시 _ 사용"
              checked={setting.useCopyReplace}
              onChange={(useCopyReplace) => {
                setSetting((prev) => ({
                  ...prev,
                  useCopyReplace,
                }))
              }}
            />
          </FormBlock>
        </div>
      </Modal>
    </>
  )
}
