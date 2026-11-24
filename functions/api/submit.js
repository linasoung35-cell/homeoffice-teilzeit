import {json} from './_shared.js';

export async function onRequestPost({request,env}) {
  try {
    const x = await request.json();

    if (x.website) return json({error:'Ungültige Eingabe'},400);
    if (!x.consent) return json({error:'Bitte bestätige die Veröffentlichung'},400);

    const title = String(x.title||'').trim();
    const category = String(x.category||'').trim();
    const location = String(x.location||'').trim();
    const description = String(x.description||'').trim();
    const email = String(x.email||'').trim();

    if (
      title.length < 4 || title.length > 100 ||
      !category ||
      location.length < 2 || location.length > 100 ||
      description.length < 20 || description.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254
    ) {
      return json({error:'Bitte prüfe die Pflichtfelder und Mindestlängen.'},400);
    }

    await env.DB.prepare(
      "INSERT INTO listings (title,category,location,description,email,status,created_at) VALUES (?,?,?,?,?,'pending',datetime('now'))"
    ).bind(title,category,location,description,email).run();

    return json({ok:true},201);
  } catch(e) {
    return json({error:'Einreichen derzeit nicht möglich. Bitte später erneut versuchen.'},503);
  }
}
