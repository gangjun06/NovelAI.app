import { DragDropContext } from "react-beautiful-dnd";
import Split from "react-split";
import { Content } from "./Content";
import { Sidebar } from "./Sidebar";

export const TagTool = () => {
  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        // updatePromptList({ from: source.index, to: destination?.index || 0 });
      }}
    >
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
