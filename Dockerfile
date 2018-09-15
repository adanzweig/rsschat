FROM node:7
RUN apt-get update -y \
    && apt-get -y install curl python build-essential git ca-certificates
WORKDIR /app
COPY package.json /app
RUN rm -rf node_modules
RUN npm install --unsafe-perm --save-dev
COPY . /app
CMD npm run dev
EXPOSE 4000