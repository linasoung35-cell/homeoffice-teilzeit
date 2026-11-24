import {json, validSession} from '../_shared.js';

export async function onRequestPost({request,env}) {
  if (!await validSession(request,env.SESSION_SECRET)) {
    return json({error:'Nicht angemeldet'},401);
  }

  try {
    const x = await request.json();
    const id = Number(x.id);
    const action = String(x.action || '');

    if (!Number.isInteger(id) || id < 1) {
      return json({error:'Ungültige Anzeige'},400);
    }

    if (!['approve','reject'].includes(action)) {
      return json({error:'Ungültige Entscheidung'},400);
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    await env.DB.prepare(
      'UPDATE listings SET status=? WHERE id=? AND status=?'
    ).bind(status,id,'pending').run();

    return json({ok:true});
  } catch(e) {
    return json({error:'Datenbankfehler'},503);
  }
}
