# KT 개통 요청 페이지 (실제 요금제 기반) - 기본 사이트 패키지

## 실행
- zip 풀고 `index.html` 실행
- 또는 GitHub Pages에 그대로 업로드

## 요금제(실제 요금제명)
- `data/plans.json`에서 5G/LTE/시니어 요금제명을 KT 공식 명칭 그대로 유지
- `tier`는 공시/특판 계산용 정책구간(37/61/90/110)

## 공시/특판 반영
- 공시: `data/gongsi.json`  (모델코드 -> 요금제명 -> 공시지원금)
- 특판: `data/special.json` (모델코드 -> tier -> 가입유형 -> 특판)

## 구간 자동 매핑
- 기본은 plans.json의 `tier`를 사용
- tier가 없으면 `assets/js/app.js`의 `policyTierFromMonthlyFee()`로 자동 매핑

업데이트: 2026-01-20
