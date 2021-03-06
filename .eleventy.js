const path = require('path');

const production = (process.env.ELEVENTY_MODE || 'development') === 'production';

const browserOptions = {
  files: 'build/**/*',
  port: 4567,
  ui: false
};

const htmlOptions = {
  collapseWhitespace: true,
  decodeEntities: true,
  removeComments: true,
};

const sassOptions = {
  domainName: 'https://stuff.oscarpalmer.se',
  outDir: path.normalize(path.join(__dirname, './build')),
  outFileName: 'styles',
  outPath: '/_/',
  outputStyle: production ? 'compressed' : 'expanded',
  sassIndexFile: 'styles.scss',
  sassLocation: path.normalize(path.join(__dirname, './source/assets/stylesheets/')),
};

module.exports = (config) => {
  config.addGlobalData('production', production);
  config.addGlobalData('timestamp', Date.now());

  if (production) {
    const html = require('html-minifier');

    config.addTransform('html', (content, path) => {
      return path.endsWith('.html')
        ? html.minify(content, htmlOptions)
        : content;
    });
  }

  config.addPlugin(require('eleventy-plugin-dart-sass'), sassOptions);

  config.setBrowserSyncConfig(browserOptions);

  return {
    dir: {
      data: '../data',
      input: 'source/pages',
      layouts: '../layouts',
      output: 'build'
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
};
