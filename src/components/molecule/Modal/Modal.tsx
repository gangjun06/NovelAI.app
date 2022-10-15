import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Button } from "~/components/atoms";

interface ModalProps {
  children: ReactNode;
  show: boolean;
  onClose?: () => void;
  closeBtn?: boolean;
  title?: string;
  buttons?: ReactNode;
}

export const Modal = ({
  children,
  show,
  onClose = () => {},
  closeBtn,
  title,
  buttons,
}: ModalProps) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center overflow-y-scroll p-5">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  "bg-base text-base-color w-full max-w-lg transform overflow-y-auto rounded-xl text-left align-middle shadow-xl backdrop-blur-md transition-all"
                )}
              >
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="w-full px-6 pt-5 text-2xl font-medium leading-6 text-title-color"
                  >
                    {title}
                  </Dialog.Title>
                )}
                <div className="px-6 py-5 text-base-color">{children}</div>
                <div className="bg-gray-200 dark:bg-zinc-800 flex justify-end gap-2 py-3 px-6">
                  {buttons}
                  {closeBtn && (
                    <Button variant="primary" onClick={onClose}>
                      확인
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
