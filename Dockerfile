# FFmpeg Worker Dockerfile
# Base image: Node.js 18 slim version
FROM node:18-slim

# Install FFmpeg
# Update package lists, install FFmpeg, clean up to reduce image size
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create and set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
# This is done before copying the rest of the files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD [ "node", "index.js" ]
