/** 헬스 체크용 API (container health check에 사용) */
export async function GET() {
	return Response.json(
		{
			status: 'success',
			data: {
				health: 'ok',
			},
		},
		{
			status: 200,
		},
	);
}
