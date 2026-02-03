# Snelstart Handleiding

Een eenvoudige gids om snel aan de slag te gaan met het Materiaal Uitleensysteem.

## ⚡ Snel Overzicht

Dit systeem helpt je om materiaal uitleningen te beheren voor leden van je duikvereniging. Je kunt:
- Leden zoeken
- Materiaal uitlenen aan leden
- Materiaal terugbrengen
- Automatisch emails versturen

## 🎯 Voor Eindgebruikers

### Materiaal Uitlenen

1. **Zoek een lid**
   - Type minimaal 2 karakters in het zoekveld
   - Selecteer het juiste lid uit de lijst

2. **Selecteer materiaal**
   - Scroll door het beschikbare materiaal
   - Gebruik de categorie knoppen om te filteren
   - Klik op items om ze te selecteren (meerdere mogelijk)

3. **Lenen**
   - Klik op de blauwe "Lenen" knop
   - Wacht op bevestiging
   - Het lid en de admin ontvangen een email

### Materiaal Terugbrengen

1. **Zoek het lid**
   - Zoek het lid dat materiaal terugbrengt

2. **Selecteer items**
   - Onder "Materiaal in Bezit" zie je alle uitgeleende items
   - Klik op items om ze te selecteren

3. **Terugbrengen**
   - Klik op de groene "Terugbrengen" knop
   - Wacht op bevestiging
   - Email wordt verzonden

## 👨‍💻 Voor Beheerders

### Database Toegang Nodig Voor:

1. **Leden toevoegen**
   - Nieuwe leden worden toegevoegd aan de `Persons` tabel
   - Deze tabel bestaat al in je database

2. **Materiaal toevoegen**
   - Voeg items toe aan de `Equipment` tabel via SQL:
   ```sql
   INSERT INTO Equipment (CategoryId, ItemNumber, Name, Brand, Size, IsAvailable)
   VALUES (1, 'TANK-001', '12L Duikfles', 'Luxfer', '12L', 1);
   ```

3. **Categorieën beheren**
   - Standaard categorieën zijn al aanwezig
   - Voeg nieuwe toe via de `EquipmentCategories` tabel

### Email Notificaties

Je ontvangt als admin een email bij:
- Elk materiaal dat wordt uitgeleend
- Elk materiaal dat wordt teruggebracht

Configureer het admin email adres via:
- Azure Portal → Static Web App → Configuration → ADMIN_EMAIL

## 🆘 Veelgestelde Vragen

### Ik zie geen leden bij het zoeken
- Zorg dat er personen in de `Persons` tabel staan
- Type minimaal 2 karakters
- Controleer de database connectie

### Ik zie geen materiaal
- Voeg materiaal toe aan de `Equipment` tabel
- Zorg dat `IsAvailable` = 1 (true)
- Controleer of je de juiste categorie hebt geselecteerd

### Emails worden niet verzonden
- Controleer SMTP instellingen in Configuration
- Verifieer email credentials
- Check spam folder

### Materiaal blijft uitgeleend staan
- Controleer of de "Terugbrengen" actie is gelukt
- Bekijk de `Loans` tabel → `ReturnedAt` moet een datum hebben
- Check de browser console voor errors

### App laadt niet
- Check of de Azure Static Web App draait
- Verifieer de deployment status in GitHub Actions
- Controleer browser console voor errors

## 🔧 Snelle Troubleshooting

### Probleem: Database error
**Oplossing:**
1. Check Azure Portal → SQL Database → Firewall
2. Voeg je IP toe
3. Zorg dat "Allow Azure services" aan staat

### Probleem: API endpoints werken niet
**Oplossing:**
1. Check Configuration → ADMIN_EMAIL
2. Verifieer alle DATABASE_* variabelen
3. Herstart de Static Web App

### Probleem: Slow performance
**Oplossing:**
1. Check database tier (upgrade indien nodig)
2. Bekijk query performance in SQL insights
3. Controleer Azure region (gebruik dichtstbijzijnde)

## 📞 Support

Problemen die je niet kunt oplossen?
1. Check de volledige README.md
2. Bekijk DEPLOYMENT.md voor setup details
3. Lees CONTRIBUTING.md voor technische details
4. Open een issue op GitHub

## 🎓 Handige Tips

### Voor Dagelijks Gebruik
- Gebruik categorie filters om snel materiaal te vinden
- Selecteer meerdere items tegelijk voor efficiëntie
- Check regelmatig welk materiaal nog uitgeleend is
- Bookmark de applicatie URL voor snelle toegang

### Voor Beheerders
- Voeg ItemNumbers toe aan materiaal voor makkelijk terugvinden
- Update inspectie datums regelmatig
- Monitor de emails voor verdachte activiteit
- Maak regelmatig backups van de database

### Voor Optimale Performance
- Gebruik Chrome of Firefox voor beste compatibiliteit
- Test op mobile voor leden die onderweg zijn
- Houd de browser cache leeg bij problemen
- Update naar laatste versie bij nieuwe features

## 🚀 Volgende Stappen

Nu je de basis kent:
1. ✅ Voeg wat testdata toe
2. ✅ Test het uitlenen en terugbrengen
3. ✅ Verifieer dat emails werken
4. ✅ Train je team leden
5. ✅ Ga live!

Veel succes met het systeem! 🎉
