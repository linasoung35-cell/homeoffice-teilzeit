export async function onRequestGet({ env }) {
  const baseUrl = 'https://homeoffice-teilzeit.pages.dev';

  try {
    const { results = [] } = await env.DB.prepare(
      `SELECT id, created_at
       FROM listings
       WHERE status = 'approved'
       ORDER BY created_at DESC`
    ).all();

    const urls = [
      `<url>
        <loc>${baseUrl}/</loc>
      </url>`,
      `<url>
        <loc>${baseUrl}/stellenangebot.html</loc>
      </url>`,
      ...results.map(job => {
        const date = String(job.created_at || '').slice(0, 10);
        const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(date)
          ? `<lastmod>${date}</lastmod>`
          : '';

        return `<url>
          <loc>${baseUrl}/stellenangebot/${Number(job.id)}</loc>
          ${lastmod}
        </url>`;
      })
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    return new Response('Sitemap momentan nicht verfügbar', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8'
      }
    });
  }
}
