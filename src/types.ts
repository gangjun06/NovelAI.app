export type TagsData = {
  [key: string]: Tag[];
};

export type Tag = {
  category: string;
  subCategory: string;
  name: string;
  tags: string[];
  nsfw: boolean;
};
