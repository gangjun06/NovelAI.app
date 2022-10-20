import { atom, PrimitiveAtom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";

type Archived = {
  category: string;
  name: string;
  tag: string;
};
type ArchivedAtom = PrimitiveAtom<Archived>;

type Category = {
  name: string;
  tags: ArchivedAtom[];
};

type CategoryAtom = PrimitiveAtom<Category>;

const archivedCategoryAtom = atomWithStorage<Category[]>("archived-data", []);
const archivedCategoryAtomsAtom = splitAtom(archivedCategoryAtom);
