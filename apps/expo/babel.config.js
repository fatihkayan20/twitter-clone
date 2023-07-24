module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "react-native-reanimated/plugin",
      "nativewind/babel",
      require.resolve("expo-router/babel"),
      [
        "module-resolver",
        {
          alias: {
            "@": "./",
          },
        },
      ],
    ],
    presets: ["babel-preset-expo"],
  };
};
