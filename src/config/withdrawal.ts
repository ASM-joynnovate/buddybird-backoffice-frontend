import type { WithdrawalListItem } from '@/types/apis/withdrawals';

export const INCOMPLETE_WITHDRAWAL_STATUSES = [
	{ status: 'stopped', label: '멈춤', color: 'var(--destructive-dot)' },
	{ status: 'retrying', label: '재시도 중', color: 'var(--warning-dot)' },
	{ status: 'running', label: '진행 중', color: 'var(--info)' },
] satisfies { status: WithdrawalListItem['status']; label: string; color: string }[];

export const WITHDRAWAL_ERRORS: Record<string, { label: string; sentence: string }> = {
	apple_unavailable: { label: 'Apple 서버 응답 없음', sentence: 'Apple 서버가 응답하지 않습니다' },
	apple_revoke_rejected: { label: 'Apple 연결 해제 거부', sentence: 'Apple에서 연결 해제를 거부했습니다' },
	apple_configuration_missing: { label: 'Apple 설정 없음', sentence: '서버에 Apple 설정이 없습니다' },
	apple_client_not_allowed: {
		label: 'Apple client ID 미등록',
		sentence: '서버에 등록되지 않은 Apple client ID입니다',
	},
	apple_signing_key_invalid: { label: 'Apple 서명 키 오류', sentence: 'Apple 서명 키가 올바르지 않습니다' },
	google_unavailable: { label: 'Google 서버 응답 없음', sentence: 'Google 서버가 응답하지 않습니다' },
	google_invalid_response: { label: 'Google 응답 오류', sentence: 'Google의 응답을 읽을 수 없습니다' },
	google_revoke_rejected: { label: 'Google 연결 해제 거부', sentence: 'Google에서 연결 해제를 거부했습니다' },
	kakao_unavailable: { label: 'Kakao 서버 응답 없음', sentence: 'Kakao 서버가 응답하지 않습니다' },
	kakao_invalid_response: { label: 'Kakao 응답 오류', sentence: 'Kakao의 응답을 읽을 수 없습니다' },
	kakao_unlink_rejected: { label: 'Kakao 연결 해제 거부', sentence: 'Kakao에서 연결 해제를 거부했습니다' },
	kakao_configuration_missing: { label: 'Kakao 설정 없음', sentence: '서버에 Kakao 설정이 없습니다' },
	kakao_credentials_invalid: {
		label: 'Kakao 사용자 ID 오류',
		sentence: '저장된 Kakao 사용자 ID가 올바르지 않습니다',
	},
	supabase_unavailable: { label: 'Supabase 서버 응답 없음', sentence: 'Supabase 서버가 응답하지 않습니다' },
	supabase_invalid_response: { label: 'Supabase 응답 오류', sentence: 'Supabase의 응답을 읽을 수 없습니다' },
	supabase_user_lookup_rejected: { label: '계정 조회 거부', sentence: 'Supabase에서 계정 조회를 거부했습니다' },
	supabase_delete_rejected: { label: '계정 삭제 거부', sentence: 'Supabase에서 계정 삭제를 거부했습니다' },
	supabase_admin_configuration_missing: { label: 'Supabase 설정 없음', sentence: '서버에 Supabase 설정이 없습니다' },
	credentials_key_missing: { label: '암호화 키 없음', sentence: '서버에 로그인 정보 암호화 키가 없습니다' },
	credentials_key_invalid: { label: '암호화 키 오류', sentence: '로그인 정보 암호화 키가 올바르지 않습니다' },
	credentials_unreadable: {
		label: '로그인 정보 복호화 실패',
		sentence: '저장된 로그인 정보를 복호화할 수 없습니다',
	},
	credentials_invalid: { label: '로그인 정보 오류', sentence: '저장된 로그인 정보가 올바르지 않습니다' },
	withdrawal_credentials_missing: { label: '로그인 정보 없음', sentence: '연결을 해제할 로그인 정보가 없습니다' },
	withdrawal_user_not_deleted: { label: '삭제되지 않은 사용자', sentence: '사용자가 삭제 상태가 아닙니다' },
	withdrawal_db_unavailable: { label: 'DB 응답 없음', sentence: 'DB가 응답하지 않습니다' },
	withdrawal_internal_error: { label: '서버 내부 오류', sentence: '서버에서 오류가 발생했습니다' },
};
