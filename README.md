# Front-Tickety

## 프로젝트 개요
### 본 프로젝트는 사내 업무 관리 시스템의 프론트엔드 웹 애플리케이션을 담당합니다.
- **프로젝트 명**: frontend
- **프로젝트 기간**: 2025.01.06. ~ 2025.02.18.
- **프로젝트 목적**: 사내 업무 관리 시스템의 웹 프론트엔드 구축
- **프로젝트 버전**: 0.1.0
- **주요 기능**:
  - 로그인 및 인증
  - 사용자 관리
  - 업무(티켓) 관리
  - 프로젝트 관리
  - 일정 관리
  - 소통 기능
  - 알림 기능
  - 통계 대시보드

## 프로젝트 구조
### 1. 패키지 구조
```plaintext
frontend/  
├── src/  
│   ├── app/                  # 주요 페이지 컴포넌트  
│   │   ├── administer/        # 관리자 페이지  
│   │   ├── login/             # 로그인 페이지  
│   │   ├── manager/           # 매니저 관련 페이지  
│   │   ├── user/              # 일반 사용자 페이지  
│   │   └── layout.tsx         # 기본 레이아웃 설정  
│   │  
│   ├── components/            # 공통 UI 컴포넌트  
│   │   ├── Buttons/           # 버튼 관련 컴포넌트  
│   │   ├── Filters/           # 필터 컴포넌트  
│   │   ├── Modals/            # 모달 컴포넌트  
│   │   ├── Profiles/          # 프로필 관련 컴포넌트  
│   │   ├── Tickets/           # 티켓(업무) 관련 컴포넌트  
│   │   ├── headerbar.tsx      # 헤더바  
│   │   └── sidebar.tsx        # 사이드바  
│   │  
│   ├── data/                  # 타이틀 데이터 
│   │  
│   ├── hooks/                 # 커스텀 훅  
│   │   ├── useAuthGuard.ts    # 인증 가드  
│   │   ├── useCategoryList.ts # 카테고리 리스트  
│   │   ├── useCommentList.ts  # 댓글 리스트  
│   │   ├── useDepartTicketList.ts # 부서별 티켓 리스트  
│   │   ├── useGuide.ts        # 가이드 관련 훅  
│   │   ├── useManageHomeTicketList.ts # 관리자 홈 티켓 리스트  
│   │   ├── useManageTicketList.ts # 관리자 티켓 리스트  
│   │   ├── useManagerList.ts  # 매니저 리스트  
│   │   ├── useMemberDetail.ts # 멤버 상세 정보  
│   │   ├── useMemberList.ts   # 멤버 리스트  
│   │   ├── useTemplate.ts     # 템플릿 관련 훅  
│   │   ├── useUserDetail.ts   # 사용자 상세 정보  
│   │   ├── useUserMainTicket.ts # 사용자 메인 티켓  
│   │   ├── useUserTicket.ts   # 사용자 티켓  
│   │   └── useUserTicketList.ts # 사용자 티켓 리스트  
│   │  
│   ├── lib/api/               # API 요청 관련  
│   │   └── axios.ts           # Axios 인스턴스 설정  
│   │  
│   ├── services/              # 서비스 로직  
│   │   ├── admin.ts           # 관리자 서비스  
│   │   ├── manager.ts         # 매니저 서비스  
│   │   ├── useSse.ts          # SSE(서버-센트 이벤트) 관련  
│   │   └── user.ts            # 사용자 서비스  
│   │  
│   ├── stores/                # 상태 관리  
│   │   ├── sseStore.ts        # SSE 관련 상태  
│   │   └── userStore.ts       # 사용자 상태  
│   │  
│   ├── react-date-range.tsx   # 날짜 선택 라이브러리 설정  
│   │  
│   ├── .eslintrc.json         # ESLint 설정  
│   ├── .gitignore             # Git 무시할 파일 설정  
│   ├── .prettierrc.json       # Prettier 설정  
│   ├── Dockerfile             # Docker 설정  
│   ├── README.md              # 프로젝트 설명  
│   ├── next.config.ts         # Next.js 설정  
│   ├── package-lock.json      # npm 패키지 잠금 파일  
│   ├── package.json           # 패키지 설정 파일  
│   ├── postcss.config.mjs     # PostCSS 설정  
│   ├── src.zip                # 소스 코드 압축 파일  
│   ├── tailwind.config.ts     # Tailwind CSS 설정  
│   └── tsconfig.json          # TypeScript 설정 
```

## 팀 협업 전략
### 1. 브랜치 전략
- **🚀 main**: 실 서버 배포가 이루어지는 브랜치입니다.
  - `main` 브랜치에는 배포 가능한 상태만을 반영합니다.
  - `main` 브랜치에서는 실제 소스 수정 및 개발을 진행하지 않습니다.
  - `main` 브랜치의 소스가 변경이 될 때, `tag`를 생성하게 됩니다.

  
- **♻️ release**: 배포 전 최종 검증 및 QA가 이루어지는 브랜치입니다.
    - `release` 브랜치는 배포 전 안정성을 검증하고 최종테스트를 진행합니다.
    - `release` 브랜치는 `develop` 브랜치에서 생성합니다.
    - 테스트 혹은 QA과정에서 발생된 문제를 `release` 브랜치에서 수정하며, 수정된 내용은 반드시 `develop` 브랜치에 병합합니다.
    - `release` 브랜치의 모든 검증이 완료되면, `main` 브랜치에 병합합니다.

  
- **✅ develop**: 배포 및 빌드가 이루어지는 브랜치입니다.
    - `develop` 브랜치는 `feature` 브랜치에서 개발이 완료된 기능이 올라오는 브랜치입니다.
    - `develop` 브랜치에서 기능이 배포가 가능 할 정도로 완성되면 `release` 브랜치로 병합합니다.

  
- **🚑 hotfix**: 개발이 완료된 프로젝트의 긴급한 수정사항이나 버그 수정 시 사용하는 브랜치입니다.
  - `hotfix` 브랜치는 수정 완료 시, 병합과 동시에 삭제합니다.


- **✨ feature**: 기능 개발을 위한 브랜치입니다.
  - `feature` 브랜치는 개인별 작업이 이루어지는 소스들의 병합이 진행됩니다.
  - `feature` 브랜치는 `main` 브랜치로 직접 접근이 불가합니다.
  - `feature` 브랜치는 작업하고자 하는 티켓을 브랜치 명으로 생성합니다.
  - 개발 완료 시, `develop` 브랜치로 병합과 동시에 삭제합니다.
  
<img src="https://private-user-images.githubusercontent.com/44363238/405489078-724ac54f-caa9-455a-b018-e699cefc2313.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzc1MjUxNDEsIm5iZiI6MTczNzUyNDg0MSwicGF0aCI6Ii80NDM2MzIzOC80MDU0ODkwNzgtNzI0YWM1NGYtY2FhOS00NTVhLWIwMTgtZTY5OWNlZmMyMzEzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAxMjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTIyVDA1NDcyMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTdkZDcxYjE0N2UyYzU3NmI3NjZlODcyNmE5YjEyN2ZhOWFlYzBjNzI2ZTg3MmQ5YWMwMDc4YTA5ZmNjM2Q3NjImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.OpAcdIvkIqh4nAdmnsNxGqgqqLVrR5TlPVF3OQgYF2g" width="500" >

### 2. 커밋 전략
- **a. 커밋 메시지 작성의 중요성**
    - 팀원과의 원활한 소통을 위해
    - 편리한 history 추적을 위해
    - 이슈(issue) 관리를 위해
  

- **b. 커밋 메시지 양식**
```
WRKR-<티켓번호> :Emoji: <type>: <subject>

<body>
- <Scope>
	- discription

<footer>
# 이슈 번호
```

```
WRKR-1 :sparkles: Feature: 게시글 작성 API 연결

```

- **c. 커밋 메시지 타입**

  | Type      | Emoji               | Description                                      |
  |-----------|---------------------|--------------------------------------------------|
  | Feature   | ✨ (sparkles)       | 새로운 기능 추가                                 |
  | Fix       | 🐛 (bug)           | 버그 수정                                        |
  | Docs      | 📝 (memo)          | 문서 수정                                        |
  | Style     | 🎨 (art)           | 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우 |
  | Refactor  | ♻️ (recycle)       | 코드 리팩토링                                    |
  | Test      | ✅ (white_check_mark) | 테스트 코드, 리팩토링 테스트 코드 추가            |
  | Chore     | 🔧 (wrench)        | 빌드 업무 수정, 패키지 매니저 수정               |
  | Wip       | 🚧 (construction)  | 완료되지 않은 작업 임시 커밋 (가능하다면 지양합시다!) |
  | Rename    | 🚚 (truck)         | 파일 or 폴더명 수정하거나 옮기는 경우            |

- **d. 커밋 항목 설명**
    - **Header**: 작업 중인 브랜치의 티켓 번호
    - **Emoji**: 커밋의 타입을 이모지로 표현
    - **Type**: 커밋의 타입
    - **Subject**: 커밋의 간단한 한줄 요약 내용
    - **Body**: 커밋에 대한 상세 내용 (선택 사항)
    - **Footer**: 커밋과 관련된 이슈 번호 (선택 사항)

## 개발 환경 설정
### 1. 프로젝트 클론:
```bash
   git clone https://github.com/WRKR-KEA/frontend.git
```
### 2. 패키지 설치:
```bash
   npm install 
```
### 3. 프로젝트 실행:
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
First, run the development server:
```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### 4. 환경 변수 설정:
- env.properties 파일을 생성하여 아래와 같이 환경 변수를 설정합니다.
```env.properties
NEXT_PUBLIC_BASE_URL=http://172.16.211.53:8080
NEXT_PUBLIC_NOTI_URL="http://localhost:8080
```

## 5. **전체 컨벤션 정리 (Convention)**
- 코드 스타일, 리뷰 정책, 테스트 작성 규칙 등 협업 시 지켜야 할 기준을 명확히 합니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> c89984266378746af0d5cc5f69f2dbdd9d9395db
