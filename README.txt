HOME OFFICE-TEILZEIT – WEBSITE-PAKET (COUNTERAPI)
==================================================

Enthalten:
- index.html (Stellenangebot + neuer Besucherzähler)
- style.css
- impressum.html
- datenschutz.html
- robots.txt
- sitemap.xml
- googlea3d7b333e564616d.html (Google Search Console HTML-Datei-Verifizierung)

SO HOCHLADEN:
1. ZIP-Datei entpacken.
2. In Cloudflare Pages das Projekt homeoffice-teilzeit öffnen.
3. Upload and deploy / Create deployment wählen.
4. Production ausgewählt lassen.
5. Den entpackten Ordner bzw. alle 8 Dateien gemeinsam hochladen (nicht die ZIP-Datei).
6. Save and deploy drücken.
7. Danach die Website https://homeoffice-teilzeit.pages.dev öffnen und den Besucherzähler prüfen.

BESUCHERZÄHLER:
- Nutzt CounterAPI.com (https://counterapi.com/).
- Laut Anbieter kostenlos, öffentlich und ohne Registrierung/API-Schlüssel.
- Zählt Seitenaufrufe unter dem Namespace homeoffice-teilzeit.pages.dev und dem Schlüssel homepage.
- Die Zählung ist nicht IP-basiert und wird daher nicht durch die Nutzung eines VPN verhindert.
- Gezählt werden Seitenaufrufe, nicht eindeutig verifizierte Personen. Wiederholte Aufrufe können mitzählen.
- Der Anbieter gibt an, IP- und Browserinformationen in nicht zurückverfolgbare Hashwerte umzuwandeln. Datenschutzhinweise entsprechend prüfen.

GOOGLE:
Die Datei googlea3d7b333e564616d.html muss im Stammverzeichnis (Root) der Website bleiben, damit die HTML-Datei-Verifizierung von Google funktionieren kann.

WICHTIG:
- Keine Domain wird gekauft oder benötigt; verwendet wird die kostenlose pages.dev-Adresse.
- Der CounterAPI-Dienst ist ein externer Anbieter. Die Funktion wird nach dem Deployment auf der Live-Website getestet.
Deployment-Aktualisierung
