import { useSetAtom } from "jotai";
import { DragDropContext } from "react-beautiful-dnd";
import Split from "react-split";
import { moveTagAtom } from "~/hooks/tagTool";
import { Content } from "./Content";
import { Sidebar } from "./Sidebar";

export const TagTool = () => {
  const movetag = useSetAtom(moveTagAtom);
  return (
    <DragDropContext onDragEnd={(result) => movetag(result)}>
      <Split
        className="flex h-full"
        sizes={[50, 50]}
        minSize={100}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <Content />
        <Sidebar />
      </Split>
    </DragDropContext>
  );
};
