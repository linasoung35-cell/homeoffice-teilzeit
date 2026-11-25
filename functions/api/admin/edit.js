import {json, validSession} from '../_shared.js';

export async function onRequestPost({request,env}) {
  if (!await validSession(request,env.SESSION_SECRET)) {
    return json({error:'Nicht angemeldet'},401);
  }

  try {
    const x = await request.json();

    const id = Number(x.id);
    const title = String(x.title || '').trim();
    const category = String(x.category || '').trim();
    const location = String(x.location || '').trim();
    const description = String(x.description || '').trim();
    const email = String(x.email || '').trim();

    if (!Number.isInteger(id) || id < 1) {
      return json({error:'Ungültige Anzeige'},400);
    }

    if (
      title.length < 4 || title.length > 100 ||
      !category || category.length > 100 ||
      location.length < 2 || location.length > 100 ||
      description.length < 20 || description.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254
    ) {
      return json({
        error:'Bitte prüfe die Pflichtfelder und Mindestlängen.'
      },400);
    }

    const result = await env.DB.prepare(
      `UPDATE listings
       SET title=?, category=?, location=?, description=?, email=?
       WHERE id=? AND status IN ('pending','approved')`
    ).bind(
      title,
      category,
      location,
      description,
      email,
      id
    ).run();

    if (!result.meta || result.meta.changes === 0) {
      return json({error:'Anzeige nicht gefunden oder nicht bearbeitbar'},404);
    }

    return json({ok:true});
  } catch(e) {
    return json({error:'Speichern derzeit nicht möglich'},503);
  }
}
