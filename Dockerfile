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

# ✅ Coolify 환경 변수를 Prisma에 적용 (마이그레이션)
RUN DATABASE_URL=${DATABASE_URL} yarn prisma migrate deploy

# Copy app source
COPY . .

# Build the application
RUN yarn run build

# ✅ Coolify에서 자동으로 환경 변수를 주입하므로 `.env`를 복사할 필요 없음

# Start the server using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
