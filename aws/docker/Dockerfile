# base image
FROM node:latest

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY app/package.json /app/package.json
RUN npm install --loglevel=error
RUN npm install @vue/cli@3.7.0 -g --loglevel=error

# start app
CMD ["npm", "run", "serve"]