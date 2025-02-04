# 1. Node.js 18 이미지를 사용
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사
COPY package.json package-lock.json ./

# 4. 의존성 설치
RUN npm install --legacy-peer-deps

# 5. 전체 프로젝트 파일 복사
COPY . .

# 6. 환경 변수 설정하여 SSR 비활성화 후 빌드
ENV NEXT_DISABLE_SSR=1

# 7. 애플리케이션 빌드
RUN npm run build

# 8. Production 환경에서 실행
CMD ["npm", "start"]
