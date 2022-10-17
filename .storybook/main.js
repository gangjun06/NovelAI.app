const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next-router",
    "storybook-tailwind-dark-mode",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },

  /**
   * @param {import('webpack').Configuration} config
   **/
  webpackFinal: async (config, { configType }) => {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.plugins) config.resolve.plugins = [];
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
    });
    return config;
  },
};
