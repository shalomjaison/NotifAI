# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install
# RUN npm install express
# RUN npm install cors

# Copy the remaining application files
COPY . .

# Port number 9500
EXPOSE 9500

# Command to run the application when the container starts
CMD [ "npm", "start" ]
