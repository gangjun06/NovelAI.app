import { useSetAtom } from "jotai";
import { DragDropContext } from "react-beautiful-dnd";
import Split from "react-split";
import { moveTagAtom } from "~/hooks/tagTool";
import { Content } from "./Content/Content";
import { Sidebar } from "./Library/Sidebar";

export const TagTool = () => {
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
      <Content />
      <Sidebar />
    </Split>
  );
};
