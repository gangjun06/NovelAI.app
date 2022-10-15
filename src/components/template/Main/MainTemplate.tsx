import { NextSeo } from "next-seo";
import { ReactNode } from "react";
import { MainNav } from "~/components/organizm";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export const MainTemplate = ({ title, description, children }: Props) => {
  return (
    <>
      <NextSeo title={title} description={description} />
      <MainNav />
      <div>{children}</div>
    </>
  );
};