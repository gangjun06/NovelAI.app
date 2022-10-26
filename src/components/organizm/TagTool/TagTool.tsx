import {
  ArchiveBoxIcon,
  ChevronDoubleUpIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Split from "react-split";
import { useDisclosure } from "~/hooks/useDisclosure";
import { useWindowSize } from "~/hooks/useWindowSize";
import { TagToolContent } from "./Content/Content";
import { TagToolLibrary } from "./Library/Library";

export const TagTool = () => {
  const { width } = useWindowSize();
  const [showLibrary, handleShowLibrary] = useDisclosure();

  if (width > 640) {
    return (
      <Split
        className="flex h-full"
        sizes={[50, 50]}
        minSize={300}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <TagToolContent />
        <TagToolLibrary />
      </Split>
    );
  }

  return (
    <>
      {showLibrary ? <TagToolLibrary /> : <TagToolContent />}
      <button
        className="fixed z-20 bottom-32 right-0 border-t border-l border-b border-base-color bg-white dark:bg-zinc-800 rounded-l-xl text-title-color"
        onClick={handleShowLibrary.toggle}
      >
        <div
          className="px-2 py-2"
          id={showLibrary ? "hide-library" : "show-library"}
        >
          {showLibrary ? (
            <RectangleGroupIcon className="w-5 h-5" />
          ) : (
            <ArchiveBoxIcon className="w-5 h-5" />
          )}
        </div>
      </button>
    </>
  );
};
