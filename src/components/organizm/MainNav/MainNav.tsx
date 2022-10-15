import Link from "next/link";
import { useRouter } from "next/router";
import { ButtonLink } from "~/components/atoms";

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

  return (
    <nav className="px-4 py-4 shadow sticky bg-white dark:bg-zinc-900">
      <div className="sm:max-w-nav mx-auto flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
          <Link href="/" passHref>
            <a className="font-bold text-xl text-title-color pr-4">
              NovelAI.APP
            </a>
          </Link>
          <NavItem name="태그 생성기" href="/" isActive={pathname === "/"} />
          <NavItem name="정보" href="/info" isActive={pathname === "/info"} />
        </div>
        <div>
          <div>A</div>
        </div>
      </div>
    </nav>
  );
};
