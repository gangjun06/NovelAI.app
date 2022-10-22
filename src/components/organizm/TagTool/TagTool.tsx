import Split from "react-split";
import { TagToolContent } from "./Content/Content";
import { TagToolLibrary } from "./Library/Library";

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
      <TagToolContent />
      <TagToolLibrary />
    </Split>
  );
};
