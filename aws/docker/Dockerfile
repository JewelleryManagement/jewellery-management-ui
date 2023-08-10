# base image
FROM node:latest

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# ENV NODE_ENV development

# install and cache app dependencies
COPY app/package*.json /app/
# RUN npm install -g yarn
# RUN yarn install --verbose
# RUN yarn global add @vue/cli

COPY . .

# start app
CMD ["npm", "run", "serve"]