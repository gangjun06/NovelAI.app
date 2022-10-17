import { RouterContext } from "next/dist/shared/lib/router-context";
import "../src/styles/globals.scss";
import { initialize, mswDecorator } from "msw-storybook-addon";

import * as nextImage from "next/image";

Object.defineProperty(nextImage, "default", {
  configurable: true,
  value: (props) => {
    return <img {...props} />;
  },
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

initialize();

export const decorators = [mswDecorator];
