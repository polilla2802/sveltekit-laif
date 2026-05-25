import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma/prisma';

// Registrar / actualizar presencia
export async function POST({ request }) {
	const { sessionId, path } = await request.json();
	if (!sessionId) {
		return json({ error: 'Falta sessionId' }, { status: 400 });
	}

	await prisma.presence.upsert({
		where: { id: sessionId },
		update: { lastSeen: new Date(), path },
		create: { id: sessionId, path, lastSeen: new Date() }
	});

	return json({ ok: true });
}

// Eliminar presencia al salir
export async function DELETE({ request }) {
	const { sessionId } = await request.json();
	if (!sessionId) return json({ ok: true });

	try {
		await prisma.presence.delete({ where: { id: sessionId } });
	} catch {
		// Ya no existe
	}

	return json({ ok: true });
}

// Contar visitantes activos (últimos 2 minutos)
export async function GET() {
	const cutoff = new Date(Date.now() - 2 * 60 * 1000);
	const count = await prisma.presence.count({
		where: { lastSeen: { gte: cutoff } }
	});
	return json({ count });
}
