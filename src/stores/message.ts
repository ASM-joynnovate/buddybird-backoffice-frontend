import { createStore } from 'zustand/vanilla';

type Message = {
	title: string;
	content?: string;
};

type MessageState = {
	message: Message | null;
};

type MessageActions = {
	openPopup: (message: Message) => void;
	closePopup: () => void;
};

export type MessageStore = MessageState & MessageActions;

export const createMessageStore = () => {
	return createStore<MessageStore>()((set) => ({
		message: null,

		/** 메시지 다이얼로그 열기 */
		openPopup: (message) => {
			set((state) => ({ ...state, message }));
		},

		/** 메시지 다이얼로그 닫기 */
		closePopup: () => {
			set((state) => ({ ...state, message: null }));
		},
	}));
};
