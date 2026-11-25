import {json} from './_shared.js';

export async function onRequestGet({env}) {
  try {
    const primary = await env.DB.prepare(
      "SELECT id,title,category,location,description,email,created_at FROM listings WHERE status='approved' AND is_primary=1 LIMIT 1"
    ).first();

    const {results=[]} = await env.DB.prepare(
      "SELECT id,title,category,location,description,email,created_at FROM listings WHERE status='approved' AND is_primary=0 ORDER BY created_at DESC LIMIT 100"
    ).all();

    return json({
      primary: primary || null,
      items: results
    });
  } catch(e) {
    return json({error:'Datenbank noch nicht eingerichtet'},503);
  }
}
