FROM node:latest

WORKDIR /app

# Copy only package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies inside container for Linux platform
RUN npm install

# Copy the rest of the app
COPY . .

RUN npx prisma generate

CMD ["npm", "run", "dev"]
