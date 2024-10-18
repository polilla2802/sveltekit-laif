/// <reference types="@sveltejs/kit" />

declare module '$env/static/private' {
	export const VITE_FIREBASE_API_KEY: string;
	export const VITE_FIREBASE_AUTH_DOMAIN: string;
	export const VITE_FIREBASE_PROJECT_ID: string;
	export const VITE_FIREBASE_STORAGE_BUCKET: string;
	export const VITE_FIREBASE_MESSAGING_SENDER_ID: string;
	export const VITE_FIREBASE_APP_ID: string;
	export const OPENAI_KEY: string;
}
