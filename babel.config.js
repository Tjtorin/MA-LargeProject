module.exports = function(api) {
  api.cache(true);
  return {
    plugins: [
      [
        'react-native-reanimated/plugin',
        {
          globals: ['__labelImage'],
        },
      ],
    ],
    presets: ['babel-preset-expo']
  };
};