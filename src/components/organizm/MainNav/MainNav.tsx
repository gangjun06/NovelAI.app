import { CogIcon } from "@heroicons/react/24/outline";
import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, ButtonLink } from "~/components/atoms";
import { SettingModal, showModalAtom } from "../SettingModal/SettingModal";

interface Props {}

const NavItem = ({
  name,
  href,
  isActive,
}: {
  name: string;
  href: string;
  isActive: boolean;
}) => {
  return (
    <Link passHref href={href}>
      <ButtonLink variant="subtle" active={isActive}>
        {name}
      </ButtonLink>
    </Link>
  );
};

export const MainNav = ({}: Props) => {
  const { pathname } = useRouter();
  const setShowSetting = useSetAtom(showModalAtom);

  return (
    <>
      <SettingModal />
      <nav className="px-4 py-4 shadow fixed bg-white dark:bg-zinc-900 w-full z-10">
        <div className="sm:max-w-nav mx-auto flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Link href="/" passHref>
              <a className="font-bold text-xl text-title-color pr-4">
                NovelAI.APP
              </a>
            </Link>
            <NavItem name="태그 생성기" href="/" isActive={pathname === "/"} />
            <NavItem
              name="정보"
              href="/about"
              isActive={pathname === "/about"}
            />
          </div>
          <div>
            <Button
              variant="subtle"
              forIcon
              onClick={() => {
                setShowSetting(true);
              }}
            >
              <CogIcon width={28} height={28} />
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};
