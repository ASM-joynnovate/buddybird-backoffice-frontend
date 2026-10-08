---
name: 버디버드 백오피스
description: 버디버드 팀원이 앱 상태를 확인하고 내용을 등록하는 내부 도구의 깔끔하고 가독성 높은 화면 스타일
colors:
  background: "#f4f4f2"
  background-dark: "#0e0e0d"
  card: "#ffffff"
  card-dark: "#1f1f1d"
  card-inset: "#fafaf8"
  card-inset-dark: "#191918"
  muted: "#f3f3f0"
  muted-dark: "#2a2a28"
  foreground: "#141414"
  foreground-dark: "#ffffff"
  muted-foreground: "#706e68"
  muted-foreground-dark: "#918f88"
  border: "#e6e5e0"
  border-dark: "rgba(255, 255, 255, 0.09)"
  brand: "#c24e1c"
  brand-dark: "#f28b5e"
  chart-1: "#ef7b45"
  chart-1-dark: "#e06a35"
  chart-2: "#3f83f8"
  chart-2-dark: "#4f86f7"
  chart-3: "#14a38b"
  chart-3-dark: "#1aa88c"
  chart-4: "#9b6df0"
  chart-4-dark: "#9a7bf2"
  chart-neutral: "#d5d4cd"
  chart-neutral-dark: "#3d3d3a"
  success: "#006300"
  success-dark: "#3cc13c"
  info: "#1f5fb0"
  info-dark: "#7fb2f2"
  warning: "#7a5200"
  warning-dark: "#f2b93b"
  destructive: "#b3261a"
  destructive-dark: "#f07b72"
  warning-dot: "#e0a100"
  warning-dot-dark: "#f2b93b"
  destructive-dot: "#d9412f"
  destructive-dot-dark: "#f07b72"
  sidebar: "#151413"
  sidebar-dark: "#191918"
  sidebar-foreground: "#ffffff"
  sidebar-accent: "#2b2927"
  sidebar-accent-dark: "#2a2a28"
  sidebar-border: "rgba(255, 255, 255, 0.1)"
  sidebar-border-dark: "rgba(255, 255, 255, 0.08)"
  tooltip: "#141414"
  tooltip-dark: "#333330"
  tooltip-foreground: "#ffffff"
typography:
  display:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "68px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  metric:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  metric-large:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  metric-small:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.5
  tick:
    fontFamily: "Pretendard Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  page-x: "32px"
  page-top: "28px"
  page-bottom: "48px"
  page-narrow: "16px"
  card-gap: "16px"
  card-x: "20px"
  card-y: "18px"
  cell-gap: "8px"
  sidebar-width: "232px"
components:
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    width: "232px"
    padding: "20px 12px 16px"
  sidebar-menu-item:
    textColor: "rgba(255, 255, 255, 0.65)"
    rounded: "{rounded.md}"
    height: "38px"
    padding: "0 10px"
  sidebar-menu-item-current:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-foreground}"
    rounded: "{rounded.md}"
    height: "38px"
    padding: "0 10px"
  sidebar-theme-select:
    backgroundColor: "{colors.sidebar-accent}"
    rounded: "{rounded.md}"
    padding: "2px"
  sidebar-theme-select-item:
    textColor: "rgba(255, 255, 255, 0.65)"
    rounded: "{rounded.sm}"
    height: "28px"
  sidebar-theme-select-item-selected:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    rounded: "{rounded.sm}"
    height: "28px"
  menu-button:
    textColor: "{colors.sidebar-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 12px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "18px 20px"
  card-inset:
    backgroundColor: "{colors.card-inset}"
    textColor: "{colors.foreground}"
    padding: "20px 22px"
  kpi-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.metric}"
    rounded: "{rounded.xl}"
    padding: "16px 18px"
  stat-cell:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.metric-small}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  segmented-control:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "2px"
  segmented-control-item:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 14px"
  segmented-control-item-selected:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.card}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 14px"
  text-link:
    textColor: "{colors.brand}"
    typography: "{typography.label}"
  date-range:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 6px"
  date-range-input:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "28px"
    padding: "0 4px"
  list-row:
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "42px"
    padding: "0 8px"
  list-row-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: "42px"
    padding: "0 8px"
  tag-success:
    backgroundColor: "color-mix(in srgb, #006300 10%, transparent)"
    textColor: "{colors.success}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "1px 8px"
  tag-info:
    backgroundColor: "color-mix(in srgb, #1f5fb0 10%, transparent)"
    textColor: "{colors.info}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "1px 8px"
  kpi-change:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "0 6px 0 3px"
  warning-note:
    backgroundColor: "color-mix(in srgb, #7a5200 10%, transparent)"
    textColor: "{colors.foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  progress-track:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.full}"
    height: "8px"
  progress-fill:
    backgroundColor: "{colors.chart-2}"
    rounded: "{rounded.full}"
    height: "8px"
  chart-tooltip:
    backgroundColor: "{colors.tooltip}"
    textColor: "{colors.tooltip-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
---

# Design System: 버디버드 백오피스

## Overview

**Creative North Star: "깔끔하고 가독성 높은 디자인"**

버디버드 백오피스 화면을 새로 만들거나 수정할 때 이 문서의 색, 글자, 배치, 컴포넌트 기준을 따른다.
기준은 홈 화면 시안 `.impeccable/mocks/first-screen/7-dashboard.html`의 밝은 화면 및 어두운 화면에서 가져왔다.

화면은 어두운 사이드바, 옅은 회색 배경, 흰 카드로 구성한다.
카드에는 그림자가 없으며 1px 선이 카드의 경계를 표시한다.
글꼴은 Pretendard Variable 하나이고 본문 크기는 14px이다.
값은 굵기 700의 큰 글자로, 값의 이름 및 단위는 `muted-foreground` 색의 작은 글자로 적어 숫자가 먼저 읽히게 한다.
시간에 따라 변하는 값은 그래프로 보여 준다.

색은 역할이 정해져 있다.
`brand`는 링크를, `chart-1`부터 `chart-4`까지는 데이터를, `success`, `info`, `warning`, `destructive`는 상태를 나타낸다.
그 밖의 배경 및 글자는 따뜻한 회색 계열이다.
모든 색에는 밝은 화면 값 및 어두운 화면 값이 함께 있다.

**Key Characteristics:**
- 어두운 사이드바, 옅은 회색 배경, 흰 카드
- 그림자 없이 1px 선으로 표시하는 카드 경계
- Pretendard Variable, 본문 14px, 값은 굵기 700
- 링크 전용 `brand`, 역할이 정해진 데이터 색 및 상태 색
- 밝은 화면 및 어두운 화면 지원
- 화면 폭이 좁아지면 한 열로 줄어드는 카드 배치

## Colors

따뜻한 회색 배경 위에서 주황색 `brand`가 링크를 나타내고, 데이터 색 및 상태 색은 정해진 자리에만 사용한다.

색 토큰마다 밝은 화면 값 및 어두운 화면 값이 한 쌍을 이룬다.
frontmatter에서는 어두운 화면 값의 이름 뒤에 `-dark`를 붙였다.
`-dark`가 없는 토큰은 밝은 화면 및 어두운 화면에서 같은 값을 사용한다.
코드에서는 `src/app/(main)/globals.css`의 CSS 변수 하나에 `light-dark()`로 두 값을 함께 지정한다.
아래 설명은 밝은 화면 토큰 이름으로 적으며, 어두운 화면에서는 같은 이름의 `-dark` 값을 사용한다.

### Primary

`brand`는 누르면 다른 화면으로 이동하는 글자에 사용한다.

- `{colors.brand}`: `CardHeader` 오른쪽의 링크, 표 안의 링크, 키보드 포커스 표시

### Secondary

데이터 색은 그래프의 계열을 구분한다.

- `{colors.chart-1}`: 세션, 가입, 학습 단계, 알림 종류 중 리포트, 피드백, 언어 중 한국어
- `{colors.chart-2}`: 탈퇴, 휴식 단계, 알림 종류 중 공지, 앱 버전의 비율 막대, 기기 종류 중 iOS
- `{colors.chart-3}`: 스트레스 케어 단계, 알림 종류 중 마케팅, 기기 종류 중 Android
- `{colors.chart-4}`: 수면 단계, 언어 중 English
- `{colors.chart-neutral}`: 선 그래프의 세로 보조선, 아직 지나지 않은 시간의 막대, 최소 지원 버전보다 낮은 버전의 비율 막대

### Tertiary

상태 색은 태그, 경고 안내, 확인이 필요한 건수에 사용한다.

- `{colors.success}`: "게시 중" 태그의 글자
- `{colors.info}`: "예약" 태그의 글자
- `{colors.warning}`: 경고 안내의 아이콘
- `{colors.destructive}`: "확인할 항목" 카드의 전체 건수
- `{colors.destructive-dot}`: "확인할 항목" 목록의 빨간 점
  - 신호가 끊긴 세션, 응급 상황 감지, 탈퇴 실패에 사용
- `{colors.warning-dot}`: "확인할 항목" 목록의 노란 점
  - 모사 판정 실패, 프리셋 음성 거부에 사용
  - 검색어와 같은 글자의 배경에는 34% 불투명도로 사용

### Neutral

배경, 글자, 선에는 회색 계열을 사용한다.

- `{colors.background}`: 화면 배경
- `{colors.card}`: 카드, 기간 선택 버튼 그룹, 날짜 입력의 배경
  - 선택된 기간 버튼의 글자
- `{colors.card-inset}`: 카드 안에서 보조 정보를 담는 영역의 배경
  - "실행 중인 세션" 카드의 "오늘" 영역
- `{colors.muted}`: 카드 안에서 값 하나를 담는 숫자 칸의 배경, 증감 표시의 배경, 비율 막대의 빈 부분, 막대 그래프의 배경 막대, 마우스를 올린 목록 행 및 날짜 입력의 배경
- `{colors.foreground}`: 제목, 본문, 값
  - 선택된 기간 버튼의 배경
- `{colors.muted-foreground}`: 값의 이름, 단위, 보조 설명, 표 머리글, 그래프 눈금 글자, 아이콘, 선택되지 않은 기간 버튼의 글자
- `{colors.border}`: 카드 경계, 목록 및 표의 구분선, 기간 선택 버튼 그룹 및 날짜 입력의 테두리
  - 그래프 눈금선에는 50% 불투명도로 사용

### Sidebar

사이드바는 밝은 화면 및 어두운 화면에서 모두 어두운 배경을 사용한다.

- `{colors.sidebar}`: 사이드바 배경, 선택된 화면 모드 버튼의 배경
- `{colors.sidebar-foreground}`: 제품명, 선택된 메뉴, 선택된 화면 모드 버튼의 글자
  - 선택되지 않은 메뉴 및 버튼에는 65% 불투명도로 사용
- `{colors.sidebar-accent}`: 선택된 메뉴 및 마우스를 올린 메뉴의 배경, 화면 모드 선택의 배경
- `{colors.sidebar-border}`: 사이드바 경계선, 메뉴 그룹 사이의 구분선, "메뉴" 버튼의 테두리

### Tooltip

그래프 툴팁은 밝은 화면 및 어두운 화면에서 모두 어두운 배경을 사용한다.

- `{colors.tooltip}`: 그래프 툴팁의 배경
- `{colors.tooltip-foreground}`: 툴팁의 값
  - 계열 이름 및 날짜에는 75% 불투명도로 사용

### Named Rules

**The Brand Link Rule.** `brand`는 링크 및 키보드 포커스 표시에만 사용한다.
밝은 화면의 `brand`는 `card` 위에서 대비가 4.77:1이고 `background` 위에서는 4.33:1이므로 링크는 카드 안에 둔다.

**The Fixed Series Rule.** 같은 대상은 모든 그래프에서 같은 데이터 색을 사용한다.
학습은 `chart-1`, 휴식은 `chart-2`, 스트레스 케어는 `chart-3`, 수면은 `chart-4`다.

**The Mixed Tint Rule.** 옅은 배경은 토큰을 추가하지 않고 기존 색으로 만든다.
태그 및 경고 안내의 배경은 상태 색의 10% 불투명도다.
단계 칸의 배경은 데이터 색 9%를 `card`에 섞은 색이다.

## Typography

**Display Font:** Pretendard Variable
**Body Font:** Pretendard Variable

**Character:** 글꼴 하나를 크기 및 굵기로 구분해 사용한다.
굵기는 제목 및 값에 700, 값의 이름, 버튼, 링크에 600, 메뉴 및 표 머리글에 500, 본문에 400을 사용한다.

### Hierarchy

글자 크기는 역할에 따라 아래 토큰을 사용한다.

- **Display** `{typography.display}`: 화면에 하나만 두는 가장 큰 현재 값
  - "실행 중인 세션"의 개수
  - 화면 폭 860px 이하에서는 56px
- **Metric Large** `{typography.metric-large}`: 카드 하나를 대표하는 값
  - "사용자 추이"의 전체 사용자 수, "현재 세션"의 진행 시간
  - 값 뒤의 단위는 18px
- **Metric** `{typography.metric}`: 숫자 카드의 값
  - 화면 폭 860px 이하에서는 24px
  - 반원 도넛 그래프의 가운데 값은 28px, 단계 칸의 값은 26px
- **Metric Small** `{typography.metric-small}`: 숫자 칸의 값
  - "오늘" 영역의 값은 20px이고 화면 폭 860px 이하에서는 18px
- **Headline** `{typography.headline}`: 화면 제목
- **Title** `{typography.title}`: 카드 제목, 사이드바의 제품명
- **Body** `{typography.body}`: 본문, 표의 내용, 목록 행
- **Label** `{typography.label}`: 숫자 카드의 이름, 기간 선택 버튼, `CardHeader`의 링크
  - 사이드바 메뉴는 굵기 500이고 선택되면 700
- **Caption** `{typography.caption}`: `CardHeader`의 보조 정보, 값 아래의 설명, 범례, 목록 행의 보조 설명
  - 숫자 칸의 이름, 반원 도넛 그래프의 이름, 화면 아래 안내문은 12.5px
- **Tag** `{typography.tag}`: 태그
  - 툴팁 본문 및 화면 모드 버튼도 12px
- **Tick** `{typography.tick}`: 그래프 눈금 글자, 시간대 눈금 글자

값 뒤의 단위는 값보다 작은 크기, 굵기 600, `muted-foreground` 색으로 적는다.
단위 크기는 Display에서 20px, Metric에서 16px, 그 밖의 값에서 13px이다.
다만 숫자 칸은 값 및 단위를 같은 크기로 적는다.

### Named Rules

**The Value First Rule.** 값은 굵기 700의 `foreground`로, 값의 이름 및 단위는 `muted-foreground`로 적는다.
값 및 이름을 같은 굵기, 같은 색으로 적지 않는다.

**The Tabular Number Rule.** 세로로 나란히 놓이거나 값이 변하는 숫자에는 `font-variant-numeric: tabular-nums`를 적용한다.
표의 일시 및 버전, 목록의 건수 및 비율, 그래프 눈금, 날짜 입력, 숫자 칸의 값이 여기에 해당한다.

**The Keep All Rule.** 한국어 문장이 단어 중간에서 줄바꿈되지 않도록 `word-break: keep-all` 및 `overflow-wrap: break-word`를 화면 전체에 적용한다.

## Layout

화면은 왼쪽의 고정 사이드바 및 오른쪽의 본문으로 나뉜다.
사이드바 폭은 232px이다.
본문은 사이드바를 뺀 화면 폭을 모두 사용하며 여백은 위 28px, 좌우 32px, 아래 48px이다.
본문의 카드는 가로 및 세로 모두 16px 간격으로 배치한다.

카드 배치에는 아래 값을 사용한다.

- 넓은 카드 및 좁은 카드를 나란히 놓는 행: `minmax(0, 2.2fr) minmax(0, 1fr)`
- 숫자 카드 행: 같은 폭의 네 열
- 카드 안쪽 여백: 위아래 18px, 좌우 20px
- 숫자 카드 안쪽 여백: 위아래 16px, 좌우 18px
- `CardHeader` 및 카드 내용 사이: 14px
- 숫자 칸 사이: 8px
- 기간 선택 버튼 그룹 및 날짜 입력 사이: 10px

화면 폭이 좁아지면 배치를 아래처럼 변경한다.

- 1280px 이하
  - 카드 안의 좌우 영역을 위아래로 배치
  - 영역 사이의 세로선을 가로선으로 변경
- 1180px 이하
  - 숫자 카드를 두 열로 배치
  - 나란히 놓인 카드를 한 열로 배치
  - 한 열에서는 왼쪽 열의 카드, 오른쪽 열의 카드 순서로 배치
- 860px 이하
  - 사이드바를 화면 위의 가로 바 형태로 변경
  - 본문 여백을 16px로 변경
  - 카드 안 영역의 여백을 16px로 변경
  - 숫자 카드 사이의 간격을 10px로 변경

### Named Rules

**The Card Header Rule.** `CardHeader`는 제목을 왼쪽, 보조 정보나 링크를 오른쪽 끝에 두고 글자의 baseline을 맞춘다.
제목 바로 옆에 보조 정보를 붙이지 않는다.

## Elevation & Depth

깊이는 배경의 밝기 차이 및 1px 선으로 표현하고, 그림자는 그래프 툴팁에만 사용한다.
배경은 `background`, `card`, 카드 안의 `muted` 및 `card-inset` 순서로 겹친다.
`card`는 밝은 화면 및 어두운 화면에서 모두 `background`보다 밝고, `card-inset`은 두 화면에서 모두 `card`보다 어둡다.
`muted`는 밝은 화면에서 `card`보다 어둡고 어두운 화면에서는 `card`보다 밝다.

### Shadow Vocabulary

`box-shadow`에는 아래 값을 사용한다.

- **Card outline**: `box-shadow: 0 0 0 1px var(--border)`. 카드 경계를 표시하는 1px 선
- **Tooltip shadow**: `box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.4)`. 그래프 위에 표시하는 툴팁

### Named Rules

**The Flat Surface Rule.** 카드, 버튼, 입력에는 그림자를 적용하지 않는다.
그림자는 다른 내용 위에 표시하는 툴팁에만 사용한다.

## Shapes

모서리는 요소의 크기에 따라 `rounded` 토큰을 사용한다.

- `{rounded.xl}`: 카드
- `{rounded.lg}`: 숫자 칸, 단계 칸, 경고 안내, 그래프 툴팁
- `{rounded.md}`: 사이드바 메뉴, 기간 선택 버튼 그룹, 날짜 입력, 화면 모드 선택, 목록 행, "메뉴" 버튼
- `{rounded.sm}`: 그룹 안의 버튼, 날짜 입력 안의 날짜, 태그, 증감 표시, 키보드 포커스 표시
- `{rounded.full}`: 그래프의 막대, 비율 막대, 진행 막대

그룹 안의 요소는 그룹보다 한 단계 작은 모서리를 사용한다.
기간 선택 버튼 그룹은 모서리가 8px이고 안쪽 여백이 2px이므로 그룹 안의 버튼은 모서리가 6px이다.
테두리 및 구분선은 1px이며, 키보드 포커스 표시는 2px 외곽선이고 그래프의 선은 2.5px이다.
범례, 상태, 단계 이름 앞의 점은 지름 8px의 원이다.
아이콘은 `lucide-react`의 선 아이콘을 18px 크기, 선 굵기 1.75px로 사용하며, 좁은 자리에서는 14px 또는 16px로 줄인다.

## Components

키보드로 포커스한 요소에는 `brand` 색 2px 외곽선을 요소에서 2px 떨어뜨려 표시한다.
컨트롤의 크기는 4px의 배수로 정한다.
`Button`, `Input`, `Select`, 기간 선택 버튼 그룹, 날짜 입력의 높이는 36px이고 작은 크기는 28px이다.
모서리는 `{rounded.md}`이고 작은 크기 및 그룹 안의 요소는 `{rounded.sm}`이다.
`Dialog`의 모양은 이 문서가 정하지 않는다.

### Navigation

사이드바에는 화면 이동 메뉴, 화면 모드 선택, 로그아웃을 둔다.

- **Sidebar:** `{components.sidebar}`. 화면 왼쪽에 고정하고 오른쪽에 `sidebar-border` 색 1px 선을 둔다. 위에서부터 제품명, 메뉴 그룹, 화면 모드 선택, 로그아웃 순서로 배치한다
- **Brand:** 28px 마스코트 이미지, 16px 굵기 700의 "버디버드", 12px 굵기 500의 "백오피스"를 8px 간격으로 나란히 둔다
- **Menu item:** `{components.sidebar-menu-item}`. 18px 아이콘 및 14px 굵기 500의 이름을 10px 간격으로 둔다. 메뉴 그룹 사이에는 `sidebar-border` 색 1px 구분선을 위아래 8px 여백으로 둔다
- **Hover / Current:** `{components.sidebar-menu-item-current}`. 마우스를 올린 메뉴 및 현재 화면의 메뉴에 사용한다. 현재 화면의 메뉴는 굵기를 700으로 변경하고 `aria-current="page"`를 지정한다
- **Theme select:** `{components.sidebar-theme-select}`. "시스템", "밝게", "어둡게" 버튼을 같은 폭으로 나란히 둔다. 버튼은 `{components.sidebar-theme-select-item}`이고 글자는 12px 굵기 600이다. 선택된 버튼은 `{components.sidebar-theme-select-item-selected}`를 사용한다
- **Narrow screen:** 화면 폭 860px 이하에서는 화면 위의 가로 바에 제품명 및 `{components.menu-button}`만 표시한다. "메뉴" 버튼에는 `sidebar-border` 색 1px 테두리를 두른다. 버튼을 누르면 메뉴를 펼친다

### Cards

카드는 화면의 정보를 주제별로 나누는 기본 단위다.

- **Card:** `{components.card}`. 그림자 없이 `border` 색 1px 외곽선을 `box-shadow`로 그린다
- **CardHeader:** 제목은 Title로, 오른쪽 끝의 보조 정보는 Caption의 `muted-foreground`로 적는다. 오른쪽 끝의 링크는 `{components.text-link}`를 사용한다
- **Inset area:** `{components.card-inset}`. 카드 하나를 좌우 영역으로 나눌 때 보조 영역의 배경에 사용하고, 영역 사이에 `border` 색 1px 선을 둔다. 영역을 나눈 카드는 안쪽 여백을 0으로 변경한다
- **KpiCard:** `{components.kpi-card}`. 첫 행에 18px 아이콘 및 Label의 이름을 `muted-foreground`로 두고, 오른쪽 끝에 상세 화면으로 이동하는 16px 화살표 링크를 둔다. 값의 단위는 16px 굵기 600의 `muted-foreground`로 적는다. 값 아래에는 Caption 설명이나 증감 표시를 둔다
- **Stat cell:** `{components.stat-cell}`. 숫자 칸은 이름 및 값 하나를 담는다. 이름은 12.5px의 `muted-foreground`로 값 위에 적는다. 숫자 칸은 같은 폭으로 나란히 둔다
- **Series cell:** 단계 칸은 숫자 칸에 데이터 색을 더한 형태다. 안쪽 여백은 위 10px, 좌우 12px, 아래 12px이다. 이름 앞에 데이터 색 8px 점을 두고, 값 아래에 높이 4px의 진행 막대를 둔다. 진행 막대의 빈 부분은 데이터 색의 22% 불투명도다

### Buttons

시안 7의 버튼은 값 하나를 선택하는 버튼 그룹 및 링크다.

- **Segmented control:** `{components.segmented-control}`. 기간처럼 하나만 선택하는 값에 사용하고 `border` 색 1px 테두리를 두른다
- **Item / Selected:** `{components.segmented-control-item}`, `{components.segmented-control-item-selected}`. 선택된 버튼에는 `aria-pressed="true"`를 지정한다
- **Text link:** `{components.text-link}`. 마우스를 올리면 글자에서 3px 떨어진 밑줄을 표시한다. 표 안의 링크는 본문 굵기에 `brand` 색만 적용한다
- **Icon link:** 숫자 카드의 16px 화살표 링크는 `muted-foreground` 색이며 `aria-label`에 이동할 화면을 적는다
- **Add cell:** 칸으로 표시하는 목록의 마지막 칸은 항목을 추가하는 버튼이다. 크기 및 모서리는 다른 칸과 같고 `chart-neutral` 색 1px 점선 테두리를 두른다. 가운데에 16px 더하기 아이콘 및 굵기 600의 "추가"를 `muted-foreground`로 둔다. 마우스를 올리면 테두리를 `muted-foreground`, 배경을 `muted`, 글자를 `foreground`로 변경한다. 항목이 없는 목록에서는 한 행 전체를 차지한다
- **Play button:** 음성을 재생하는 버튼은 지름 36px의 원이다. 배경은 `card`, 아이콘은 `foreground` 색의 재생 아이콘이다. 마우스를 올리면 둘레 3px를 남기고 안쪽 배경을 `chart-neutral`로 변경한다. 재생 중에는 배경을 `foreground`, 아이콘을 `card` 색의 정지 아이콘으로 변경하고 둘레 3px에 진행한 만큼 `chart-1`을 채운다. 재생이 끝나면 처음 모양으로 되돌린다. `aria-label`에는 대상의 이름 뒤에 "재생" 또는 "정지"를 적는다

### Inputs

시안 7의 입력은 조회 기간의 시작일 및 종료일을 선택하는 날짜 입력이다.

- **Date range:** `{components.date-range}`. `border` 색 1px 테두리 안에 시작일, "~" 글자, 종료일을 6px 간격으로 나란히 둔다
- **Date:** `{components.date-range-input}`. 브라우저 기본 `<input type="date">`를 사용하고 `tabular-nums`를 적용한다
- **Hover:** 마우스를 올린 날짜의 배경을 `muted`로 변경한다
- **File drop area:** 파일을 고르는 영역은 `chart-neutral` 색 1px 점선 테두리, `{rounded.lg}` 모서리, `card-inset` 배경으로 그린다. 가운데에 `muted-foreground` 색 18px 아이콘, 굵기 600의 안내 문구, 12.5px `muted-foreground`의 허용 형식 및 크기를 차례로 둔다. 영역을 누르거나 파일을 끌어다 놓으면 파일을 고른다. 마우스를 올리거나 파일을 영역 위로 끌어오면 테두리를 `muted-foreground`, 배경을 `muted`로 변경한다. 파일을 고른 뒤에는 영역 대신 굵기 600의 파일 이름, `muted-foreground`의 크기, 오른쪽 끝의 작은 "파일 변경" 버튼을 한 행에 둔다
- **Field error:** 입력값의 오류는 해당 입력 아래 6px에 13px `destructive` 문구로 표시하고 `role="alert"`를 지정한다. 오류가 있는 입력에는 `aria-invalid`를 지정해 테두리를 `destructive`로 변경하고 `aria-describedby`로 문구를 연결한다. 입력값을 수정하면 문구를 지운다
- **Switch:** 켜고 끄는 설정에 사용한다. 폭 36px, 높이 20px의 끝이 둥근 막대 안에 지름 16px의 `card` 색 손잡이를 둔다. 꺼진 배경은 `muted-foreground`의 50% 불투명도, 켜진 배경은 `foreground`다. `aria-label`에 설정 이름을 넣는다

### Lists

목록은 행 사이에만 `border` 색 1px 구분선을 둔다.

- **Check item row:** `{components.list-row}`. 한 행에 색 점, 이름, 건수, 14px 화살표를 순서대로 둔다. 건수는 굵기 700에 `tabular-nums`를 적용해 오른쪽에 둔다. 행 전체가 링크이며 마우스를 올리면 `{components.list-row-hover}`를 사용한다
- **Two-line row:** 첫 행에 굵기 600의 제목 및 오른쪽 끝의 태그를, 둘째 행에 Caption의 `muted-foreground` 설명을 둔다. 행의 위아래 여백은 10px이다
- **Ratio row:** 한 행에 굵기 600의 이름, 굵기 700의 비율, 13px `muted-foreground`의 수량을 두고 그 아래에 비율 막대를 둔다. 행의 위아래 여백은 12px이다
- **Legend row:** 한 행에 8px 점, 이름, 굵기 700의 건수, `muted-foreground`의 비율을 순서대로 둔다. 행의 위아래 여백은 6px이다
- **Cell list:** 항목마다 재생, 수정, 삭제 같은 동작이 있는 목록은 구분선 없이 `muted` 배경의 칸으로 나열한다. 칸의 모서리는 `{rounded.lg}`, 최소 높이는 56px이고 칸 사이 간격은 8px이다. 안쪽 여백은 위아래 및 왼쪽 10px, 오른쪽 8px이다. 굵기 600의 이름은 한 줄로 적고 넘치면 말줄임으로 표시하며 `title`에 전체 이름을 넣는다. 이름 아래에는 Caption의 `muted-foreground` 보조 값을, 오른쪽 끝에는 28px 아이콘 버튼을 둔다. 아이콘 버튼은 `muted-foreground` 색이고 마우스를 올리면 배경을 `card`로 변경하며, 삭제 버튼은 아이콘도 `destructive`로 변경한다. 화면 폭 1280px 이상에서는 두 열로, 그보다 좁으면 `repeat(auto-fill, minmax(220px, 1fr))`로 배치한다
- **Step track:** 순서가 있는 단계는 칩을 진행 순서대로 나란히 두고 칩 사이를 길이 12px의 `chart-neutral` 색 1px 선으로 잇는다. 화면 폭 768px 미만에서는 선을 숨기고 칩 사이에 6px 간격을 둔다
- **Dialog row:** 누르면 다이얼로그가 열리는 행은 제목을 `button`으로 두고 버튼의 누르는 영역을 행 전체로 넓힌다. 마우스를 올리면 배경을 `muted`로 변경하고 배경을 좌우로 8px 넓힌다. 모서리는 `{rounded.md}`이고 오른쪽 끝에 14px 화살표를 둔다. 키보드 포커스 표시는 행 전체에 그린다

### Tags

상태는 태그, 칩, 상태 아이콘, 증감 표시, 경고 안내, 색 점으로 나타낸다.

- **Tag:** `{components.tag-success}`, `{components.tag-info}`. 글자는 상태 색이고 배경은 같은 상태 색의 10% 불투명도다
- **Chip:** 로고 및 이름을 함께 표시하는 높이 28px의 끝이 둥근 칩이다. `card` 배경에 `border` 색 1px 외곽선을 두른다. 왼쪽부터 20px 로고, 13px 굵기 600의 이름, 14px 상태 아이콘을 6px 간격으로 둔다. 상태 아이콘은 상태를 알려야 할 때만 둔다
- **Chip tone:** 실패한 칩 및 진행 중인 칩은 배경에 상태 색 8%를 `card`에 섞은 색을, 외곽선에 상태 색의 32% 불투명도를 사용한다. 대기 중인 칩은 이름을 굵기 500의 `muted-foreground`로 적는다
- **Status icon:** 완료는 `success` 색 체크, 실패는 `destructive` 색 X, 진행 중은 `info` 색의 회전하는 원호, 확인하지 못한 상태는 `warning` 색 경고 삼각형, 대기는 `muted-foreground` 색 점선 원으로 표시한다. 예정은 `info` 색 시계, 꺼짐은 `muted-foreground` 색 꺼진 종으로 표시한다. 선 굵기는 2px이다. `aria-label` 및 `title`에 상태 이름을 넣는다. `prefers-reduced-motion`에서는 원호를 회전시키지 않는다
- **Change:** `{components.kpi-change}`. 14px 화살표 및 굵기 700의 비율을 둔다. 증가 및 감소는 화살표 방향으로 구분하고 색은 변경하지 않는다
- **Warning note:** `{components.warning-note}`. 한 행에 `warning` 색 16px 아이콘, 문구, 오른쪽 끝의 굵기 700 수치를 둔다. 배경은 `warning`의 10% 불투명도다
- **Dot:** 지름 8px의 원이다. "확인할 항목" 목록에는 `destructive-dot` 및 `warning-dot`를, 범례에는 데이터 색을 사용한다. 점 옆에는 이름을 글자로 적는다

### Logos

로고는 값의 이름 앞에 둔다.

- **Platform logo:** 기기 종류의 로고는 16px이다. iOS는 `foreground` 색 원 안에 `card` 색 로고를 넣고, Android는 원 없이 `#3ddc84` 색 로고만 표시한다

### Tables

표는 카드 안에 두며 행 사이의 `border` 색 1px 구분선으로만 행을 구분한다.

- **Header:** 굵기 500의 `muted-foreground`로 적고 줄바꿈하지 않는다. 여백은 8px이다
- **Cell:** 여백은 위아래 10px, 좌우 8px이고 내용을 위쪽에 맞춘다. 첫 열의 왼쪽 여백 및 마지막 행의 아래 여백은 0이다
- **Meta cell:** 일시 및 버전처럼 보조 값인 열은 `muted-foreground`에 `tabular-nums`를 적용하고 줄바꿈하지 않는다
- **Two-line cell:** 값 및 보조 설명을 함께 담는 칸은 첫 줄에 굵기 600의 `foreground` 값을, 둘째 줄에 12.5px `muted-foreground` 설명을 둔다
- **Narrow screen:** 화면 폭 860px 이하에서는 우선순위가 가장 낮은 열을 숨긴다. "최근 피드백" 표는 "사용자" 열을 숨긴다

### Charts

그래프는 등장 애니메이션 없이 표시하며 `role="img"` 및 그래프 내용을 설명하는 `aria-label`을 지정한다.

- **Axis:** 눈금 글자는 Tick의 `muted-foreground`다. 가로 눈금선은 `border`의 50% 불투명도 1px 선이다. 막대 그래프는 값 0의 눈금선만, 선 그래프는 모든 눈금선을 그린다. 축 선은 그리지 않는다
- **Bar:** 막대 폭은 14px 이하이고 위쪽 끝이 둥글다. 막대마다 뒤에 `muted` 색 배경 막대를 그래프 높이만큼 둔다. 지난 날짜의 막대는 42% 불투명도, 오늘의 막대 및 마우스를 올린 막대는 100%이다. 불투명도는 150ms 동안 변경한다
- **Line:** 선은 2.5px 굵기의 곡선이다. 첫 계열의 아래에는 계열 색이 26% 불투명도에서 0%로 옅어지는 그라데이션을 채운다. 마지막 값에는 반지름 5px 점을 표시하고 점에 `card` 색 2.5px 테두리를 두른다
- **Last value:** 마지막 값은 막대 또는 점 위에 12px 굵기 700의 `foreground`로 적는다
- **Hover:** 마우스를 올리거나 키보드로 포커스한 날짜에 툴팁을 표시한다. 선 그래프는 그 날짜에 `chart-neutral` 색 세로 보조선 및 계열별 점을 함께 표시한다
- **Half donut:** 반원 도넛 그래프는 굵기 16px의 끝이 둥근 호로 그린다. 계열 사이에 5px 간격을 두고 뒤에 `muted` 색 호를 둔다. 가운데에는 28px 굵기 700의 값 및 12.5px `muted-foreground`의 이름을 적는다
- **Hourly bars:** 시간대별 막대는 폭 8px이고 위쪽 끝이 둥글다. 지난 시간은 `chart-1`의 38% 불투명도로, 현재 시간은 `chart-1`로 표시한다. 아직 지나지 않은 시간은 높이 4px의 `chart-neutral` 50% 불투명도로 표시한다. 화면 폭 860px 이하에서 막대 폭은 6px이다
- **Ratio bar:** `{components.progress-track}` 위에 `{components.progress-fill}`을 둔다. 강조하지 않는 항목은 채운 부분에 `chart-neutral`을 사용한다
- **Stacked ratio bar:** 순서가 있는 값의 비율을 한 줄에 나란히 놓는 막대는 데이터 색, 데이터 색의 62%, 데이터 색의 30%, `chart-neutral`, `chart-neutral`의 45%를 차례로 사용한다. 여섯 번째 값부터는 다섯 번째 색을 사용한다
- **Stacked ratio groups:** 제목, 비율 막대, 범례를 묶은 그룹이 넷 이상이면 격자로 배치한다. 열은 카드 폭에 따라 두 개 또는 세 개이고 화면 폭 768px 미만에서는 한 개다. 간격은 세로 18px, 가로 24px이다
- **Legend:** `CardHeader` 오른쪽에 8px 점, 13px `muted-foreground`의 계열 이름, 굵기 700 `foreground`의 합계를 순서대로 둔다. 화면 폭 860px 이하에서는 숨긴다
- **Tooltip:** `{components.chart-tooltip}`. 계열마다 한 행에 8px 점, 13px 굵기 700의 값, 12px 계열 이름을 두고 마지막 행에 날짜를 둔다. 계열 이름 및 날짜는 `tooltip-foreground`의 75% 불투명도다. 가리키는 값의 12px 위에 표시하며 120ms 동안 나타난다
- **Schedule bar:** 기간은 높이 8px의 끝이 둥근 막대로 그린다. 바탕은 `chart-2`의 22% 불투명도이고 시작부터 현재 시각까지를 `chart-2`로 채운다. 현재 시각에는 `foreground` 색 1px 세로선을, 7일마다 `border`의 50% 불투명도 1px 세로선을 둔다. 영역을 넘는 막대는 그 끝에서 자르고 잘린 쪽의 모서리는 둥글게 하지 않는다

## Do's and Don'ts

### Do

- **Do** 카드는 `card` 배경, 14px 모서리, `border` 색 1px 외곽선으로 그린다
- **Do** `CardHeader`는 제목을 왼쪽, 보조 정보나 링크를 오른쪽 끝에 둔다
- **Do** 값마다 이름 및 값을 따로 배치한다
- **Do** 값이 여럿이면 숫자 칸으로 나눈다
- **Do** 카드 안의 요소는 `muted` 배경의 칸이나 `border` 색 1px 구분선으로 구분한다
- **Do** 시간에 따라 변하는 값은 그래프로 보여 준다
- **Do** 같은 대상에는 모든 그래프에서 같은 데이터 색을 사용한다
- **Do** 확인이 필요한 항목은 한 행에 색 점, 이름, 건수만 둔다
- **Do** 색 점 옆에는 이름을 글자로 적는다
- **Do** 세로로 나란히 놓이는 숫자에는 `tabular-nums`를 적용한다
- **Do** 색을 추가할 때는 밝은 화면 값 및 어두운 화면 값을 함께 정한다
- **Do** 그래프에는 `role="img"` 및 내용을 설명하는 `aria-label`을 지정한다

### Don't

- **Don't** 값을 가운뎃점으로 이어 한 문장에 적지 않는다
- **Don't** 화면 위에서 선택한 기간을 카드 문구에 다시 적지 않는다
- **Don't** `CardHeader`의 제목 바로 옆에 보조 정보를 붙이지 않는다
- **Don't** 카드, 버튼, 입력에 그림자를 적용하지 않는다
- **Don't** `brand`를 버튼 배경이나 넓은 배경에 사용하지 않는다
- **Don't** 막대를 14px보다 굵게 그리지 않는다
- **Don't** 지난 날짜의 막대를 100% 불투명도로 그리지 않는다
- **Don't** 옅은 배경에 사용할 색 토큰을 추가하지 않는다. 기존 색에 불투명도를 적용한다
