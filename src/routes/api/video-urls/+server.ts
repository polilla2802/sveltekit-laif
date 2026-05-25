import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma/prisma';

export async function GET() {
	try {
		const rows = await prisma.videoUrl.findMany();
		const result: Record<string, { mainVideoSrc: string; altVideoSrc: string }> = {};
		rows.forEach((r: { id: string; mainVideoSrc: string; altVideoSrc: string }) => {
			result[r.id] = { mainVideoSrc: r.mainVideoSrc, altVideoSrc: r.altVideoSrc };
		});
		return json(result);
	} catch {
		return json({});
	}
}

export async function POST({ request }) {
	const { key, mainVideoSrc, altVideoSrc } = await request.json();
	if (!key || !mainVideoSrc) {
		return json({ error: 'Faltan campos requeridos' }, { status: 400 });
	}

	await prisma.videoUrl.upsert({
		where: { id: key },
		update: { mainVideoSrc, altVideoSrc },
		create: { id: key, mainVideoSrc, altVideoSrc }
	});

	return json({ ok: true });
}
