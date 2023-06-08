# triptopping-frontend

[![](https://img.shields.io/badge/TripTopping-online-brightgreen)](https://trip.abys.dev)

> [TripTopping 홈페이지](https://trip.abys.dev)

## 팀원 및 역할 분담

- 심지수 201820708, rlj1202@ajou.ac.kr, rlj1202 (GitHub)
  - 로그인/회원가입 코드 작성
- 주진형 201720798, jujh97@ajou.ac.kr JuJinHyeong (GitHub)
  - Google Maps 렌더링 담당
- 신상민 201820735, sss@ajou.ac.kr qilip (GitHub)
  - UI 디자인, CI/CD 담당
- 현광빈 201720728, bio8641@ajou.ac.kr, BEEPMan (GitHub)
  - 여행 계획 및 커뮤니티 화면 담당

## 사용 기술 스택

- [Next.js](https://nextjs.org/) - 프론트엔드 프레임워크
- [TailwindCSS](https://tailwindcss.com/) - CSS 프레임워크
- [daisyUI](https://daisyui.com/) - TailwindCSS 라이브러리
- [Cloudflare Pages](https://pages.cloudflare.com/) - CI/CD에 사용

## 프로젝트 구조

```
public/            # Static serve 파일
src/
  components/      # Component들
  contexts/        # React context들
  pages/           # Next.js routes
  services/        # Axios 통신 코드
  styles/          # css 파일들
  types/           # Typescript 타입 파일
  utils.ts         # 유틸 코드
.eslintrc.json     # Eslint 설정 파일
.prettierrc        # Prettier 설정 파일
package.json       # 프로젝트 설정 파일
tailwind.config.js # TailwindCSS 설정 파일
tsconfig.json      # Typescript 설정 파일
```

## 협업 방식

- Git 브랜치 전략은 GitFlow를 사용

## 코딩 컨벤션

- ESlint 및 Prettier를 사용
- Indent는 space 2번으로 통일

## 실행

개발 서버 실행:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

[http://localhost:3000](http://localhost:3000)로 접속

### 라이센스

<a href="https://www.flaticon.com/free-icons/dm" title="dm icons">Dm icons created by IYAHICON - Flaticon</a>
