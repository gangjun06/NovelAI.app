import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Atoms/Typography",
};

const TEXT = "This text is ";

export const Typography = () => (
  <div className="text-md">
    <div className="text-black dark:text-white">
      <div className="text-5xl">{TEXT} text-5xl</div>
      <div className="text-4xl">{TEXT} text-4xl</div>
      <div className="text-3xl">{TEXT} text-3xl</div>
      <div className="text-2xl">{TEXT} text-2xl</div>
      <div className="text-xl">{TEXT} text-xl</div>
      <div className="text-lg">{TEXT} text-lg</div>
      <div className="text-md">{TEXT} text-md</div>
      <div className="text-sm">{TEXT} text-sm</div>
      <div className="text-xs">{TEXT} text-xs</div>
    </div>
    <hr className="my-4" />
    <div className="border border-base bg-white dark:bg-zinc-900 rounded px-2 py-2">
      <div className="text-title-color text-2xl">{TEXT} text-title-color</div>
      <div className="text-subtitle-color">{TEXT} text-subtitle-color</div>
      <div className="text-description-color">
        {TEXT} text-description-color
      </div>

      <div className="text-base-color">{TEXT} text-base-color</div>
    </div>
  </div>
);
