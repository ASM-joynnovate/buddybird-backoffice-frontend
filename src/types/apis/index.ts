export default interface ApiResponse {
	success: boolean;
	message: string;
	data: Record<string, unknown> | null | string | number | object;
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
