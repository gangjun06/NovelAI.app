import { ReactNode } from "react";

interface Props {
  label?: string;
  children?: ReactNode;
}

export const FormBlock = ({ label, children }: Props) => {
  return (
    <div>
      <label className="mb-1.5 text-subtitle-color">{label}</label>
      <div className="mx-0.5 flex flex-col gap-1">{children}</div>
    </div>
  );
};
