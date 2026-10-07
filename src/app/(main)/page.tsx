import { redirect } from 'next/navigation';

/** 사용자 목록으로 이동하는 첫 페이지 */
export default function Page() {
	redirect('/users');
}
