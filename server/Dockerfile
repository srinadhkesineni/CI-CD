# Use official Node.js LTS version
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your backend uses (adjust if different)
EXPOSE 8080

# Set environment variable (optional, for production)
ENV NODE_ENV=production

# Start the server
CMD ["node", "index.js"]
