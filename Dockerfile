FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install        # cached if package.json didn’t change
COPY . .               # only rest of files now
CMD ["npm", "test"]
