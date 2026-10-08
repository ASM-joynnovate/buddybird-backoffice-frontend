import type { SessionEndedReason, SessionEvent, SessionPhase } from '@/types/apis/sessions';

export const SESSION_PHASES = {
	learning: { label: '학습', color: 'var(--chart-1)' },
	rest: { label: '휴식', color: 'var(--chart-2)' },
	stress_care: { label: '스트레스 케어', color: 'var(--chart-3)' },
	sleeping: { label: '수면', color: 'var(--chart-4)' },
} satisfies Record<SessionPhase, { label: string; color: string }>;

export const SESSION_ENDED_REASONS = {
	user: { label: '사용자 종료', sentence: '사용자가 종료했습니다.' },
	scheduled: { label: '예정 시각', sentence: '예정 시각이 되어 끝났습니다.' },
	heartbeat_expired: { label: '신호 끊김', sentence: '신호가 끊겨 끝났습니다.' },
	logout: { label: '로그아웃', sentence: '로그아웃으로 끝났습니다.' },
	device_deleted: { label: '기기 삭제', sentence: '기기가 삭제되어 끝났습니다.' },
	device_released: { label: '기기 해제', sentence: '기기가 해제되어 끝났습니다.' },
} satisfies Record<SessionEndedReason, { label: string; sentence: string }>;

export const SESSION_EVENTS = {
	session_started: { label: '세션 시작', color: 'var(--foreground)' },
	learning_started: { label: '학습 시작', color: 'var(--chart-1)' },
	learning_toggled: { label: '학습 전환', color: 'var(--chart-1)' },
	learning_finished: { label: '학습 종료', color: 'var(--chart-1)' },
	word_changed: { label: '단어 변경', color: 'var(--chart-2)' },
	station_disconnected: { label: '연결 끊김', color: 'var(--destructive-dot)' },
	station_reconnected: { label: '다시 연결', color: 'var(--chart-3)' },
	emergency_detected: { label: '응급 상황 감지', color: 'var(--destructive-dot)' },
	session_finished: { label: '세션 종료', color: 'var(--foreground)' },
} satisfies Record<SessionEvent['kind'], { label: string; color: string }>;
