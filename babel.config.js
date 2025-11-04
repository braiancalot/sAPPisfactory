module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@ui": "./src/components/ui",
            "@feature": "./src/components/features",
          },
        },
      ],
    ],
  };
};
