import type { StabilityEnvironment, StabilityIssuePriority, StabilityIssueSort } from '@/types/apis/dashboard';

export const SERVICE_LINKS = [
	{
		label: 'Google Analytics',
		logoSrc: '/images/services/google-analytics.svg',
		href: 'https://analytics.google.com/analytics/web/#/a394877482p538111158/reports/intelligenthome',
	},
	{
		label: 'Firebase',
		logoSrc: '/images/services/firebase.svg',
		href: 'https://console.firebase.google.com/project/buddybird-9b84d/overview',
	},
	{
		label: 'Clarity',
		logoSrc: '/images/services/clarity.svg',
		href: 'https://clarity.microsoft.com/projects/view/wre3hgbj48/dashboard?date=Last%203%20days',
	},
	{ label: 'Sentry', logoSrc: '/images/services/sentry.svg', href: 'https://joynnovate.sentry.io/issues/' },
];

export const ISSUE_SORT_LABELS = {
	date: '최근 10개',
	freq: '발생 상위 10개',
	user: '사용자 상위 10개',
} satisfies Record<StabilityIssueSort, string>;

export const ISSUE_LEVELS: Record<string, { label: string; color: string }> = {
	fatal: { label: '치명', color: 'var(--destructive-dot)' },
	error: { label: '오류', color: 'var(--destructive-dot)' },
	warning: { label: '경고', color: 'var(--warning-dot)' },
	info: { label: '정보', color: 'var(--info)' },
};

export const ISSUE_ENVIRONMENT_LABELS = {
	prod: '운영',
	dev: '개발',
	local: '로컬',
} satisfies Record<StabilityEnvironment, string>;

export const ISSUE_PRIORITY_LABELS = {
	high: '높음',
	medium: '보통',
	low: '낮음',
} satisfies Record<StabilityIssuePriority, string>;

// 앱의 온보딩 화면 순서
export const ONBOARDING_STEPS = [
	{ step: 'login', label: '로그인' },
	{ step: 'consent', label: '동의' },
	{ step: 'legacy_upload', label: '이전 데이터 업로드' },
	{ step: 'parrot', label: '앵무새 등록' },
	{ step: 'usage_guide', label: '사용 안내' },
	{ step: 'permissions', label: '권한 요청' },
	{ step: 'marketing_notification', label: '마케팅 알림' },
];

export const ANALYTICS_EVENT_NAMES: Record<string, string> = {
	onboarding_step_viewed: '온보딩 단계 조회',
	onboarding_step_completed: '온보딩 단계 완료',
	onboarding_completed: '온보딩 완료',
	word_create_started: '단어 추가 시작',
	word_created: '단어 추가',
	word_edit_started: '단어 수정 시작',
	word_updated: '단어 수정',
	word_deleted: '단어 삭제',
	recording_started: '녹음 시작',
	recording_finished: '녹음 완료',
	learning_started: '학습 시작',
	learning_paused: '학습 일시정지',
	learning_resumed: '학습 재개',
	learning_finished: '학습 종료',
	report_viewed: '리포트 조회',
	session_detail_viewed: '세션 상세 조회',
	parrot_sound_played: '앵무새 소리 재생',
	parrot_sound_shared: '앵무새 소리 공유',
	notification_opened: '알림 열기',
	language_changed: '언어 변경',
	update_prompt_shown: '업데이트 안내 표시',
	update_prompt_accepted: '업데이트 안내 수락',
	update_prompt_dismissed: '업데이트 안내 닫기',
	feedback_prompt_shown: '의견 요청 표시',
	feedback_prompt_dismissed: '의견 요청 닫기',
	feedback_submitted: '의견 제출',
	app_foregrounded: '앱 열기',
	app_backgrounded: '앱 나가기',
	app_error: '앱 오류',
	screen_view: '화면 조회',
	// Firebase가 자동으로 수집하는 이벤트
	first_open: '첫 실행',
	session_start: '접속 시작',
	user_engagement: '앱 사용',
	app_update: '앱 업데이트',
	os_update: 'OS 업데이트',
	app_remove: '앱 삭제',
	app_clear_data: '앱 데이터 삭제',
	app_exception: '비정상 종료',
	notification_receive: '푸시 수신',
	notification_open: '푸시 열기',
	notification_dismiss: '푸시 닫기',
	notification_foreground: '앱 사용 중 푸시 수신',
};
