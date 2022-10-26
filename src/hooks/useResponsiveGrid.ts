import { CSSProperties, useMemo } from "react";
import { useElementSize } from "./useElementSize";

// grid-template-columns: repeat(2, minmax(0, 1fr));

const sizeList = [350, 640, 768, 1024, 1280, 1536, 1800, 100000000];

export const useResponsiveGrid = (gridSize: number[]) => {
  const size = useElementSize();

  const gridStyle: CSSProperties = useMemo(() => {
    const result = sizeList.findIndex((data) => data > size.width);

    return {
      gridTemplateColumns: `repeat(${gridSize[result]}, minmax(0, 1fr))`,
    };
  }, [gridSize, size.width]);

  return { ref: size.ref, gridStyle };
};
