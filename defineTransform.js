const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const upstreamTransformer = require('metro-react-native-babel-transformer');

let envPath = '';
if (fs.existsSync(path.resolve('.env'))) {
  envPath = '';
} else if (fs.existsSync(path.resolve('.env.local'))) {
  envPath = '.local';
}

// different env
dotenv.config({ path: `.env${envPath}` });

module.exports.transform = function (file) {
  const { plugins, ...rest } = file;
  return upstreamTransformer.transform({
    ...rest,
    plugins: [
      ...plugins,
      [
        'transform-define',
        {
          __API_HOST__: process.env.__API_HOST__,
        },
      ],
    ],
  });
};
