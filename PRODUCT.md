# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

사용자는 버디버드 팀원이다.
백오피스를 여는 장면은 세 가지이며 2026-10-07에 확인했다.

- 매일 상태 확인: 하루에 한 번 이상 열어 새 피드백, 처리 중인 탈퇴, 새 가입자를 확인
- 문의 및 오류 대응: 문의나 Sentry 오류가 들어오면 특정 사용자를 찾아 기기, 세션, 푸시 발송 기록을 확인
- 내용 등록 작업: 공지 작성, 알림 발송, 앱 업데이트 등록, 고지문 게시

## Product Purpose

버디버드 백오피스는 버디버드 앱의 사용자 데이터 및 앱에 노출되는 내용을 팀원이 조회하고 등록하는 내부 도구다.
앱 제품 정보는 `../buddybird-mobile/PRODUCT.md`에 있다.

## Operating Context

- 노트북, 데스크톱, 휴대폰 브라우저에서 연다
- 로그인은 팀이 공유하는 비밀번호 하나로 하며 서버에는 `X-Backoffice-Password` 헤더로 전달한다
- 서버는 `../buddybird-api`이고 백오피스 API는 `/api/v1/backoffice` 아래에 있다
- 화면 문구는 한국어이며 시각은 `Asia/Seoul` 기준으로 표시한다

## Capabilities and Constraints

### 현재 화면

- 사용자 목록, 사용자 상세, 사용자 삭제, 사용자별 세션 및 푸시 발송 기록
- 공지, 고지문, 앱 업데이트, 알림 발송, 단어 프리셋, 피드백, 탈퇴 처리 현황
- `/legacy` 아래의 오디오 클립 라벨링 화면

### 제약

- 통계 전용 API가 없다. 첫 화면의 숫자는 목록 API의 응답으로만 계산한다
- 목록 API의 `meta`는 `current_page`, `total_page_count`, `is_first`, `is_last`만 제공한다. 전체 개수는 `count_by_page=1`로 요청한 `total_page_count`로 구한다
- 목록 API는 최신순으로 정렬하며 `count_by_page`는 최대 100이다
- 피드백에는 확인 여부를 저장하는 항목이 없다

## Brand Commitments

- 제품명은 버디버드 백오피스다
- 글꼴은 Pretendard Variable이며 `public/fonts/pretendard`에 있다

## Evidence on Hand

- API 명세는 `https://dev.buddybird.xyz/api/openapi.json`에 있다
- 사용 통계, 일별 가입자 수, 활성 세션 수를 제공하는 API는 없다. 시안과 화면에서 이 값을 실제 값처럼 표시하지 않는다

## Product Principles

- 첫 화면은 팀원이 확인하고 조치할 항목을 가장 먼저 보여 준다
- 숫자는 계산한 범위를 함께 표시한다
- 목록에서 조치 화면까지 한 번의 클릭으로 이동한다
