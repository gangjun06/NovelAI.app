import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";

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
                  "bg-dark/60 w-full max-w-lg transform overflow-y-auto rounded-xl text-left align-middle shadow-xl backdrop-blur-md transition-all"
                )}
              >
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="w-full px-6 pt-5 text-2xl font-medium leading-6 text-gray-100"
                  >
                    {title}
                  </Dialog.Title>
                )}
                <div className="px-6 py-5 text-base text-gray-400">
                  {children}
                </div>
                <div className="bg-dark flex justify-end gap-2 py-3 px-6">
                  {buttons}
                  {closeBtn && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-sm font-medium text-violet-100 hover:bg-violet-500 focus:outline-none"
                      onClick={onClose}
                    >
                      확인
                    </button>
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
