# Base image
FROM node:latest

# Create app directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Install yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# ✅ Prisma 관련 파일 복사 (중요!)
COPY prisma ./prisma

# ✅ Prisma Client 설치 및 생성
RUN yarn add @prisma/client && yarn prisma generate

# ✅ Prisma 마이그레이션 적용
RUN yarn prisma migrate deploy

# ✅ Seed 데이터 실행
RUN yarn prisma db seed

# Copy app source
COPY . .

# Build the application
RUN yarn run build

# Start the server using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
