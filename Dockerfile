FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3002
CMD node index.js