import { goto } from '$app/navigation';

export function takeMeHome() {
	goto('/');
}

export function takeMeToVideos() {
	goto('/videos');
}
