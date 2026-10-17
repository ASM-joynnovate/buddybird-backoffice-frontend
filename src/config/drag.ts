import type { Announcements, ScreenReaderInstructions } from '@dnd-kit/core';

export const DRAG_SCREEN_READER_INSTRUCTIONS: ScreenReaderInstructions = {
	draggable:
		'스페이스 키를 눌러 들고 화살표 키로 옮긴 뒤 스페이스 키를 다시 눌러 놓습니다. Esc 키를 누르면 취소합니다.',
};

export const DRAG_ANNOUNCEMENTS: Announcements = {
	onDragStart: () => '들었습니다.',
	onDragOver: ({ over }) => (over ? '위치를 옮겼습니다.' : '놓을 수 있는 위치를 벗어났습니다.'),
	onDragEnd: ({ over }) => (over ? '놓았습니다.' : '원래 위치로 되돌렸습니다.'),
	onDragCancel: () => '옮기기를 취소했습니다.',
};
