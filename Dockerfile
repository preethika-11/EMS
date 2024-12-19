FROM node:20.10.0-alpine
WORKDIR /employee-management
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]