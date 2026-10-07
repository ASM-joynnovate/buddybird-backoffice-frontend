'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

import { useStore } from 'zustand';

import { createMessageStore, type MessageStore } from '@/stores/message';

type MessageStoreApi = ReturnType<typeof createMessageStore>;

const MessageStoreContext = createContext<MessageStoreApi | undefined>(undefined);

interface Props {
	children: ReactNode;
}

/**
 * 메시지 store provider
 * @param children 감싸는 내용
 */
export const MessageStoreProvider = ({ children }: Props) => {
	const [store] = useState(createMessageStore);

	return <MessageStoreContext.Provider value={store}>{children}</MessageStoreContext.Provider>;
};

/** 메시지 store 값을 선택하는 Hook */
export const useMessageStore = <T,>(selector: (store: MessageStore) => T) => {
	const store = useContext(MessageStoreContext);

	if (!store) {
		throw new Error('useMessageStore must be used within MessageStoreProvider');
	}

	return useStore(store, selector);
};
