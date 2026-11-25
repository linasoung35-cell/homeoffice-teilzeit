const ACCESS_KEY = '22d33330-6e1b-4706-920c-6ae9ef01c109';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function hideEmails(value) {
  return String(value ?? '').replace(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    '[E-Mail-Adresse ausgeblendet]'
  );
}

function response(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

export async function onRequestGet({ env, params }) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id < 1) {
    return response('<h1>Stellenanzeige nicht gefunden</h1>', 404);
  }

  try {
    const job = await env.DB.prepare(
      `SELECT id, title, category, location, description,
              created_at
       FROM listings
       WHERE id = ? AND status = 'approved'
       LIMIT 1`
    ).bind(id).first();

    if (!job) {
      return response('<h1>Stellenanzeige nicht gefunden</h1>', 404);
    }

    const title = String(job.title || '');
    const location = String(job.location || '');
    const description = hideEmails(job.description || '');
    const pageUrl =
      'https://homeoffice-teilzeit-portal.pages.dev/stellenangebot/' +
      job.id;

    const created = String(job.created_at || '');
    const parsedDate = new Date(
      created.includes('T') ? created : created.replace(' ', 'T') + 'Z'
    );

    const datePosted = Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString().slice(0, 10)
      : parsedDate.toISOString().slice(0, 10);

    // Homeoffice auch in Titel und Beschreibung erkennen
    const isRemote =
      /homeoffice|home-office|remote|deutschlandweit/i.test(
        [title, location, description].join(' ')
      );

    const jobPosting = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title,
      description,
      datePosted,
      employmentType: 'PART_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Lina Soung',
        sameAs: 'https://homeoffice-teilzeit-portal.pages.dev/'
      },
      directApply: true,
      url: pageUrl
    };

    if (isRemote) {
      jobPosting.jobLocationType = 'TELECOMMUTE';
      jobPosting.applicantLocationRequirements = {
        '@type': 'Country',
        name: 'DE'
      };
    }

    const schema = JSON.stringify(jobPosting)
      .replace(/</g, '\\u003c');

    const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow">
  <meta name="description" content="${esc(title)} – ${esc(location)}">
  <link rel="canonical" href="${pageUrl}">
  <link rel="stylesheet" href="/style.css">
  <title>${esc(title)} | Homeoffice-Teilzeit</title>
  <script type="application/ld+json">${schema}</script>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 20px;
      color: #242424;
    }
    main {
      max-width: 850px;
      margin: 35px auto;
    }
    .job-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 14px;
      padding: 24px;
    }
    .description {
      line-height: 1.7;
      margin-top: 24px;
    }
    .contact-form {
      margin-top: 28px;
      padding: 20px;
      background: #faf8f3;
      border: 1px solid #e5dfd2;
      border-radius: 12px;
    }
    label {
      display: block;
      margin: 14px 0;
      font-weight: 600;
    }
    input, textarea {
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: 12px;
      margin-top: 6px;
      border: 1px solid #ccc;
      border-radius: 7px;
      font: inherit;
    }
    textarea { min-height: 130px; }
    button {
      padding: 12px 20px;
      border: 0;
      border-radius: 7px;
      background: #222;
      color: white;
      cursor: pointer;
      font: inherit;
    }
    .status { margin-top: 12px; }
  </style>
</head>
<body>
<main>
  <a href="/">← Zur Startseite</a>
  <article class="job-card">
    <p><strong>Aktuelles Stellenangebot</strong></p>
    <h1>${esc(title)}</h1>
    <p><strong>${esc(job.category)}</strong> · ${esc(location)}</p>
    <div class="description">${esc(description).replace(/\r?\n/g, '<br>')}</div>

    <form class="contact-form" id="application-form">
      <h2>Jetzt bewerben</h2>
      <input type="hidden" name="access_key" value="${ACCESS_KEY}">
      <input type="hidden" name="subject" value="${esc('Bewerbung: ' + title)}">

      <label>Dein Name *
        <input name="name" required maxlength="120">
      </label>

      <label>Deine E-Mail-Adresse *
        <input name="email" type="email" required maxlength="254">
      </label>

      <label>Deine Nachricht *
        <textarea name="message" required maxlength="5000"></textarea>
      </label>

      <button type="submit">Bewerbung senden</button>
      <p class="status" id="form-status" role="status"></p>
    </form>
  </article>
</main>

<script>
document.getElementById('application-form').addEventListener('submit', async event => {
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector('button');
  const status = document.getElementById('form-status');

  button.disabled = true;
  status.textContent = 'Bewerbung wird gesendet …';

  try {
    const result = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    });

    const data = await result.json();

    if (!result.ok || !data.success) {
      throw new Error('Bewerbung konnte nicht gesendet werden.');
    }

    form.reset();
    status.textContent = 'Vielen Dank! Deine Bewerbung wurde gesendet.';
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
</script>
</body>
</html>`;

    return response(html);

  } catch (error) {
    return response('<h1>Stellenanzeige momentan nicht verfügbar</h1>', 503);
  }
}
