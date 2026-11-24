import {json} from './_shared.js';

export async function onRequestGet({env}) {
  try {
    const {results=[]} = await env.DB.prepare(
      "SELECT id,title,category,location,description,email,created_at FROM listings WHERE status='approved' ORDER BY created_at DESC LIMIT 100"
    ).all();

    return json({items:results});
  } catch(e) {
    return json({error:'Datenbank noch nicht eingerichtet'},503);
  }
}
