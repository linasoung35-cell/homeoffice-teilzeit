HOME OFFICE TEILZEIT – GitHub/Cloudflare Pages Paket

Dieses Paket enthält die bisherige statische Website und die Moderations-Funktion für Besucheranzeigen. Anzeigen werden zunächst als pending gespeichert und erscheinen erst nach Freigabe.

WICHTIG: Vor der Veröffentlichung muss Cloudflare Pages mit GitHub verbunden und eine D1-Datenbank eingerichtet werden. Die bestehende Pages Direct Upload-Deployment-Methode unterstützt die Functions in diesem Paket nicht.

1) GitHub: Repository homeoffice-teilzeit öffnen. Upload alle Dateien und Ordner aus diesem Paket (ZIP vorher entpacken); Dateien und Ordner müssen im Repository-Stamm liegen. Commit changes.
2) Cloudflare Dashboard > Workers & Pages > Pages > Create/Connect to Git > GitHub > Repository homeoffice-teilzeit. Build command leer lassen, Build output directory: / (oder Cloudflare für Pages Functions Static assets konfigurieren; bei Problemen Standard-Framework: None und Root-Verzeichnis).
3) Cloudflare Pages > Settings > Functions: D1 database binding hinzufügen mit Variable/Binding Name DB und deiner D1-Datenbank.
4) Cloudflare D1 > Datenbank > Console: Inhalt von schema.sql ausführen.
5) Cloudflare Pages > Settings > Variables and Secrets: Secret ADMIN_PASSWORD (ein starkes eigenes Passwort) und Secret SESSION_SECRET (mindestens 32 zufällige Zeichen). Niemals diese Werte in GitHub eintragen.
6) Deploy. Admin-Bereich: https://DEINE-SEITE/admin.html

API: GET /api/listings (nur freigegebene Anzeigen), POST /api/submit, POST /api/admin/login, GET /api/admin/listings, POST /api/admin/decision, POST /api/admin/logout.

Das Paket enthält deine bisherige Google Search Console HTML-Verifizierungsdatei. Bitte nach erfolgreichem Deployment prüfen, ob sie weiterhin unter /google6840a1e19a5a6e50.html erreichbar ist.

Hinweis: Admin-Funktionen benötigen D1 und die beiden Secrets. Ohne Einrichtung wird das Formular nicht vollständig funktionieren. Die Seite nimmt keine Datei-/Bildanhänge an. Bitte rechtliche Hinweise und Datenschutz für nutzergenerierte Anzeigen prüfen und aktualisieren.
