# 1. Node.js 18 이미지를 사용
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 빌드 시점 환경 변수 설정
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_DISABLE_SSR=1

# 4. 환경 변수 설정 (런타임에서도 유지)
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_DISABLE_SSR=${NEXT_DISABLE_SSR}
ENV NODE_ENV=production

# 5. 의존성 파일 복사
COPY package.json package-lock.json ./

# 6. 의존성 설치
RUN npm install --legacy-peer-deps

# 7. 전체 프로젝트 파일 복사
COPY . .

# 8. 애플리케이션 빌드
RUN npm run build

# 9. Production 환경에서 실행
CMD ["npm", "run", "start"]
