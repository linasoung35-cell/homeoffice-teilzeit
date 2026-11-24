import {json} from '../_shared.js';

export async function onRequestPost() {
  return json({ok:true},200,{
    'Set-Cookie':'admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
  });
}
