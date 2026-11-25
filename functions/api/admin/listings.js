import {json, validSession} from '../_shared.js';

export async function onRequestGet({request,env}) {
  if (!await validSession(request,env.SESSION_SECRET)) {
    return json({error:'Nicht angemeldet'},401);
  }

  try {
    const {results=[]} = await env.DB.prepare(
      "SELECT * FROM listings WHERE status IN ('pending','approved') ORDER BY created_at ASC"
    ).all();

    return json({items:results});
  } catch(e) {
    return json({error:'Datenbankfehler'},503);
  }
}
