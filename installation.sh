# Shell script to install everything needed for both frontend and backend

# install node, check with "node -v", "npm-v"
# note: npm i same as npm install

# Webpack
echo STARTING INSTALLATION WEBPACK
npm i --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin

# CORS
echo STARTING INSTALLATIONS CORS
npm install cors

# Babel
echo STARTING INSTALLATION BABEL
npm i --save-dev babel-loader @babel/preset-env @babel/core @babel/plugin-transform-runtime @babel/preset-react @babel/eslint-parser @babel/runtime @babel/cli

echo STARTING INSTALLATION PATH
npm i path

# Lint
# npm i --save-dev eslint eslint-config-airbnb-base eslint-plugin-jest eslint-config-prettier path

#dot env for login page processes
echo "Installing dotenv..."
npm install dotenv
echo "installing bcrypt for password safety"
npm install bcrypt
npm install axios

npm install react-router-dom # for page redirection

# React
echo STARTING INSTALLATION REACT
npm i react react-dom

# Express
echo STARTING INSTALLATION EXPRESS
npm install express
npm install express-session

# pg 
echo STARTING INSTALLATION PG
npm install pg
npm install sequelize pg pg-hstore
npm install multer
npm install node-ical
# css-loader (frontend)
echo INSTALLING CSS-LOADER
npm install --save-dev css-loader

echo REMOVING DEPRECATED PACKAGES
rm -r node_modules/inflight
rm -r node_modules/glob


# testing frame works
echo INSTALLING JEST AND HTTP TESTING FRAMEWORK  
npm install --save-dev jest supertest

# gen ai sdk
echo INSTALLING GOOGLE AI SDK
npm install @google/generative-ai

# markdown formatting for chatbot
echo INSTALLING MARKDOWN FORMATTING FOR GEMINI
npm install react-markdown

echo INSTALLING REACT TRANSITIONS
npm install react-transition-group