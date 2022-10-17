export const MainFooter = () => {
  return (
    <footer className="w-full text-center py-2 text-base-color mt-auto absolute bottom-0 left-0 z-[1]">
      © {new Date().getFullYear()}{" "}
      <a href="https://github.com/gangjun06">Kangjun Lee</a>
    </footer>
  );
};
