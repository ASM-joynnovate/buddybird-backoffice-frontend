export type CamelToSnake<T> =
	T extends Array<infer U>
		? Array<CamelToSnake<U>>
		: T extends Record<string, unknown>
			? { [K in keyof T as SnakeCase<string & K>]: CamelToSnake<T[K]> }
			: T;

export type SnakeCase<S extends string> = S extends `${infer T}${infer U}` ? `${Uncapitalize<T>}${SnakeCase<U>}` : S;

export type SnakeToCamel<T> =
	T extends Array<infer U>
		? Array<SnakeToCamel<U>>
		: T extends Record<string, unknown>
			? { [K in keyof T as CamelCase<string & K>]: SnakeToCamel<T[K]> }
			: T;

export type CamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${Capitalize<T>}${CamelCase<U>}` : S;
