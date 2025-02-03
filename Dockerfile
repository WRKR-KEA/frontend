# 1단계: 의존성 설치
FROM node:18-alpine AS deps
WORKDIR /app

# package.json 및 package-lock.json 파일을 복사하여 의존성 설치
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci

# 2단계: 빌드
FROM node:18-alpine AS builder
WORKDIR /app

# 의존성 및 애플리케이션 파일 복사
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 애플리케이션 빌드
RUN npm run build

# 3단계: 실행 환경
FROM node:18-alpine AS runner
WORKDIR /app

# 환경 설정
ENV NODE_ENV production

# 시스템 의존성 설치 (필요한 경우)
RUN apk add --no-cache libc6-compat

# 애플리케이션 사용자 생성
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# 빌드한 애플리케이션 파일 복사
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 사용자 변경
USER nextjs

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행 명령
CMD ["node", "server.js"]
