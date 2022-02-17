/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 */

module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('./defineTransform.js'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
