import { ComponentProps } from 'react'
import classNames from 'classnames'

import { Modal } from '../Modal/Modal'

interface Props extends Omit<ComponentProps<typeof Modal>, 'children'> {
  headData: string[]
  bodyData: string[][]
}

export const TableModal = ({ headData, bodyData, closeBtn = true, ...modalProps }: Props) => {
  return (
    <Modal closeBtn={closeBtn} {...modalProps}>
      <table className="table-auto w-full">
        <thead className="text-xs font-semibold uppercase text-subtitle-color">
          <tr>
            {headData.map((str, index) => (
              <th className="p-2 whitespace-nowrap" key={index}>
                <div className="font-semibold text-left">{str}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200 dark:divide-zinc-700/90 text-description-color overflow-x-scroll">
          {bodyData.map((list, index) => (
            <tr key={index}>
              {list.map((item, index) => (
                <td className="p-2" key={index}>
                  <div className="flex items-center">
                    <div
                      className={classNames(
                        'text-subtitle-color',
                        index === 0 ? 'font-medium' : 'text-left text-description-color',
                      )}
                    >
                      {item}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  )
}
