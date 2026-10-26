/** container health check용 API */
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
