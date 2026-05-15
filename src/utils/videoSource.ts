const YT_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'];

export function isYouTubeUrl(src: string): boolean {
	if (!src) return false;
	try {
		const url = new URL(src);
		return YT_HOSTS.includes(url.hostname);
	} catch {
		return false;
	}
}

function extractYouTubeId(src: string): string | null {
	try {
		const url = new URL(src);
		const host = url.hostname;
		const path = url.pathname;

		if (host === 'youtu.be') {
			return path.slice(1).split('/')[0] || null;
		}

		const watchId = url.searchParams.get('v');
		if (watchId) return watchId;

		const segments = path.split('/').filter(Boolean);
		// /live/<id>, /embed/<id>, /shorts/<id>, /v/<id>
		const known = ['live', 'embed', 'shorts', 'v'];
		const idx = segments.findIndex((s) => known.includes(s));
		if (idx !== -1 && segments[idx + 1]) return segments[idx + 1];

		return null;
	} catch {
		return null;
	}
}

type EmbedOptions = {
	autoplay?: boolean;
	muted?: boolean;
	loop?: boolean;
	controls?: boolean;
	playsinline?: boolean;
};

export function toYouTubeEmbedUrl(src: string, opts: EmbedOptions = {}): string | null {
	const id = extractYouTubeId(src);
	if (!id) return null;

	const {
		autoplay = true,
		muted = true,
		loop = true,
		controls = true,
		playsinline = true
	} = opts;

	const params = new URLSearchParams({
		autoplay: autoplay ? '1' : '0',
		mute: muted ? '1' : '0',
		controls: controls ? '1' : '0',
		playsinline: playsinline ? '1' : '0',
		rel: '0',
		modestbranding: '1'
	});

	if (loop) {
		params.set('loop', '1');
		params.set('playlist', id);
	}

	return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
