FROM node:20.16.0-alpine

WORKDIR /app

ENV TZ=Asia/Seoul
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages ./packages
COPY tsconfig.json ./

RUN yarn install
RUN yarn workspace @sunrin-para/api build

EXPOSE 3000

CMD [ "yarn", "workspace", "@sunrin-para/api", "start" ]
