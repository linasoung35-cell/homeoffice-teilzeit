import {json, makeSession} from '../_shared.js';

export async function onRequestPost({request,env}) {
  try {
    const x = await request.json();
    const password = String(x.password || '');

    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
      return json({error:'Admin-Zugang ist nicht eingerichtet.'},503);
    }

    if (password.length > 500 || password !== env.ADMIN_PASSWORD) {
      return json({error:'Falsches Passwort.'},401);
    }

    const token = await makeSession(env.SESSION_SECRET);

    return json({ok:true},200,{
      'Set-Cookie': `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`
    });
  } catch(e) {
    return json({error:'Anmeldung fehlgeschlagen.'},400);
  }
}
