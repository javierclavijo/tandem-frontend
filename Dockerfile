FROM node:lts-alpine3.14

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm clean-install
RUN npm install -g serve

COPY . /app/

# Source: https://mherman.org/blog/dockerizing-a-react-app/
