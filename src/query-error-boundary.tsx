'use client';

import { Component, ComponentType, ErrorInfo, ReactNode } from 'react';

import { ErrorBoundaryFallbackProps } from '@suspensive/react';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

type ErrorBoundaryProps = {
	FallbackComponent: ComponentType<ErrorBoundaryFallbackProps>;
	onReset: () => void;
	children: ReactNode;
};

/**
 * 에러 발생 시 API 요청을 재시도하기 위한 wrapper
 *
 * 에러 발생 시 reset 함수를 통해 API 요청을 초기화하기 위해 사용
 *
 * @see https://www.mintmin.dev/blog/2404/20240427
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = {
			hasError: false,
			error: null,
		};

		this.reset = this.reset.bind(this);
	}

	/** 에러 상태 변경 */
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.log({ error, errorInfo });
	}

	/** 에러 상태 기본 초기화 */
	reset(): void {
		this.props.onReset();

		this.setState({
			hasError: false,
			error: null,
		});
	}

	render() {
		const { state, props } = this;

		const { hasError, error } = state;

		const { FallbackComponent, children } = props;

		if (hasError && error) {
			return <FallbackComponent error={error} reset={this.reset} />;
		}

		return children;
	}
}

export default ErrorBoundary;
