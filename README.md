# HCM Navigator (호치민 내비게이터)

호치민시를 위한 지도 기반 길찾기 애플리케이션입니다. Google Maps API를 활용하여 출발지에서 목적지까지의 최적 경로를 안내합니다.

## 주요 기능

- 🗺️ **실시간 지도 표시**: Google Maps 기반의 인터랙티브 지도
- 📍 **현재 위치 추적**: GPS를 활용한 현재 위치 자동 감지
- 🚗 **경로 안내**: 출발지와 목적지 간 최적 경로 탐색
- ⏱️ **예상 시간 및 거리**: 실시간 교통 정보 반영
- 🏛️ **인기 장소 추천**: 벤탄 시장, 노트르담 대성당 등 호치민 주요 명소 빠른 검색
- 🌓 **다크/라이트 모드**: 사용자 환경에 맞는 테마 지원

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **지도**: Google Maps JavaScript API, React Google Maps API
- **스타일링**: Tailwind CSS, Radix UI
- **상태 관리**: React Hooks

## 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/leeseoyang/VIETNAM-GLOBAL-CAPSTONE.git
cd VIETNAM-GLOBAL-CAPSTONE
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 Google Maps API 키를 추가하세요:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Google Maps API 키 발급 방법:**
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. API 및 서비스 > 라이브러리에서 다음 API 활성화:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. API 및 서비스 > 사용자 인증 정보에서 API 키 생성

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
npm start
```

### Vercel 배포

이 프로젝트는 Vercel에 최적화되어 있습니다:

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 환경 변수(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) 설정
4. 자동 배포

## 사용 방법

1. **현재 위치 확인**: 앱 실행 시 자동으로 현재 위치를 감지합니다
2. **출발지 입력**: 출발지 입력창에 위치를 입력하거나 인기 장소에서 선택
3. **도착지 입력**: 도착지 입력창에 목적지를 입력
4. **경로 검색**: 입력 완료 후 자동으로 경로가 계산됩니다
5. **경로 확인**: 지도에 표시된 경로와 예상 시간, 거리를 확인

## 프로젝트 구조

```
v/
├── app/
│   ├── page.tsx          # 메인 지도 페이지
│   ├── layout.tsx        # 레이아웃 설정
│   └── globals.css       # 전역 스타일
├── components/
│   ├── ui/               # UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── page.tsx
│   └── splash-screen.tsx
├── lib/
│   └── utils.ts          # 유틸리티 함수
├── package.json
├── tsconfig.json
└── README.md
```

## 라이선스

이 프로젝트는 글로벌 캡스톤 프로젝트의 일환으로 개발되었습니다.

## 문의

문제나 제안사항이 있으시면 [Issues](https://github.com/leeseoyang/VIETNAM-GLOBAL-CAPSTONE/issues)에 등록해주세요.
