import { forwardRef, Fragment, useCallback, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { FormBlock, FormBlockProps, formBlockPropsRemover } from '../FormBlock/FormBlock'

type OptionType<T> = { label: string; value: T }

export type SelectProps<T> = {
  name?: string
  defaultValue?: T
  options: OptionType<T>[]
  onChange?: (value: T) => void
  labelProps?: React.ComponentPropsWithoutRef<'label'>
  onBlur?: React.PropsWithoutRef<JSX.IntrinsicElements['div']>['onBlur']
  ref?: any
} & FormBlockProps

const SelectContent = <T,>(
  { name, defaultValue, options, onChange, ...props }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const otherProps = formBlockPropsRemover(props)

  const [selected, setSelected] = useState<T>(defaultValue ?? options[0].value)

  const onSelect = useCallback(
    (value: any) => {
      setSelected(value)
      if (typeof onChange === 'function') onChange(value)
    },
    [onChange],
  )

  return (
    <Listbox as="div" name={name} {...props} value={selected} onChange={onSelect}>
      {({ open }) => (
        <div ref={ref} className="relative">
          <FormBlock {...props} customLabel={Listbox.Label} name={name}>
            <Listbox.Button className="relative w-full cursor-default rounded-lg border text-subtitle-color border-base-color bg-white dark:bg-zinc-800 py-2 pl-3 pr-10 text-left sm:text-sm">
              <span className="bl0ck truncate">
                {options.find((o) => o.value === selected)?.label}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className={classNames(
                    'h-5 w-5 text-gray-400 transition-all duration-300',
                    open && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="border border-base-color absolute z-[99] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-800 py-1 text-base shadow-sm focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={`${option.value}`}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? 'bg-primary-400 dark:bg-primary-600 text-white'
                          : 'text-subtitle-color dark:text-white'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal',
                          )}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-subtitle-color dark:text-white">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </FormBlock>
        </div>
      )}
    </Listbox>
  )
}

export const Select = forwardRef(SelectContent)
