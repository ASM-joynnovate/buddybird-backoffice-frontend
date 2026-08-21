export default interface ApiResponse {
	message: string;
	data: Record<string, unknown> | null | string | number | object;
	meta?: Record<string, unknown> | null;
}

export class ApiError {
	code: string;
	message: string;
	status: number;

	constructor(code: string, message: string, status: number) {
		this.code = code;
		this.message = message;
		this.status = status;
	}
}
