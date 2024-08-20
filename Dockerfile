# Use the official Node.js image as the base image
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install the dependencies with --ignore-engines
RUN yarn install --ignore-engines

# Copy the rest of the application code
COPY . .

# Rebuild native modules
RUN yarn install --force

# Copy the environment file
COPY .env .env

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["yarn", "start"]
