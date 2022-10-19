export {}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SECRET: string
			ENV: "test" | "dev" | "prod"
		}
	}
}
