# install node, check with "node -v", "npm-v"

# Webpack
echo STARTING INSTALLATION WEBPACK
npm i --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin

# Babel
echo STARTING INSTALLATION BABEL
npm i --save-dev babel-loader @babel/preset-env @babel/core @babel/plugin-transform-runtime @babel/preset-react @babel/eslint-parser @babel/runtime @babel/cli

echo STARTING INSTALLATION PATH
npm i path

# Lint
# npm i --save-dev eslint eslint-config-airbnb-base eslint-plugin-jest eslint-config-prettier path

# React
echo STARTING INSTALLATION REACT
npm i react react-dom

echo REMOVING DEPRECATED PACKAGES
rm -r node_modules/inflight
rm -r node_modules/glob