# Deployment Handleiding

Deze handleiding helpt je om de Materiaal Uitleensysteem applicatie te deployen naar Azure.

## Vereisten

- Azure account met actieve subscriptie
- GitHub repository toegang
- SQL Server beschikbaar in Azure

## Stap 1: Azure SQL Database Setup

1. **Maak een Azure SQL Database aan**
   - Ga naar Azure Portal
   - Maak een nieuwe SQL Database
   - Noteer de server naam, database naam, en inloggegevens

2. **Voer het database schema uit**
   - Verbind met de database via Azure Portal Query Editor of SQL Server Management Studio
   - Open `/database/schema.sql`
   - Voer het volledige script uit
   - Controleer of de tabellen zijn aangemaakt:
     - EquipmentCategories (met seed data)
     - Equipment
     - Loans

3. **Configureer Firewall Regels**
   - Voeg je IP-adres toe aan de firewall regels
   - Voeg Azure Services toe aan de toegestane IP's

## Stap 2: Azure Static Web App Aanmaken

1. **Via Azure Portal**
   - Zoek naar "Static Web Apps"
   - Klik op "Create"
   - Vul de volgende gegevens in:
     - Resource Group: Maak nieuwe of selecteer bestaande
     - Name: `lidportaalv3` (of eigen keuze)
     - Plan type: Free (voor development) of Standard (voor productie)
     - Region: West Europe (of dichtstbijzijnde regio)
     - Source: GitHub
     - Organization: Jouw GitHub organisatie
     - Repository: `lidportaalv3`
     - Branch: `main`
     - Build Details:
       - App location: `/`
       - Api location: `api`
       - Output location: `build`

2. **Deployment Token**
   - Na aanmaken, ga naar de resource
   - Kopieer de "Deployment token" (wordt automatisch als GitHub secret toegevoegd)

## Stap 3: Environment Variables Configureren

1. **In Azure Portal**
   - Ga naar je Static Web App
   - Selecteer "Configuration" in het menu
   - Voeg de volgende Application settings toe:

```
DATABASE_SERVER=jouw-server.database.windows.net
DATABASE_NAME=jouw-database-naam
DATABASE_USER=jouw-gebruikersnaam
DATABASE_PASSWORD=jouw-wachtwoord
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USER=jouw-email@domain.com
MAIL_PASSWORD=jouw-email-wachtwoord
ADMIN_EMAIL=admin@domain.com
```

2. **Sla de configuratie op**

## Stap 4: Email Account Configureren

### Optie A: Office 365 SMTP
1. Gebruik je Office 365 account credentials
2. Zorg dat SMTP authenticatie is ingeschakeld
3. Gebruik smtp.office365.com:587

### Optie B: Microsoft Graph API (geavanceerd)
1. Registreer een app in Azure AD
2. Geef Mail.Send permissies
3. Update de email service code om Graph API te gebruiken

## Stap 5: Deployment

1. **Automatische Deployment**
   - Push naar de `main` branch
   - GitHub Actions start automatisch
   - Deployment duurt ongeveer 5-10 minuten
   - Controleer de Actions tab in GitHub voor status

2. **Deployment URL**
   - Na succesvolle deployment, vind je de URL in Azure Portal
   - Format: `https://<app-name>.<region>.azurestaticapps.net`

## Stap 6: Testen

1. **Open de applicatie URL**
2. **Test de functionaliteit:**
   - Zoek een lid (moet minstens 1 persoon in Persons tabel staan)
   - Bekijk beschikbaar materiaal (voeg eerst items toe aan Equipment tabel)
   - Test het uitlenen van materiaal
   - Test het terugbrengen van materiaal
   - Controleer email notificaties

## Troubleshooting

### Database connectie mislukt
- Controleer firewall regels in SQL Server
- Verifieer dat "Allow Azure services" is ingeschakeld
- Controleer connection string in Configuration

### Email verzending mislukt
- Verifieer SMTP credentials
- Check of SMTP is toegestaan voor het account
- Test SMTP connectie lokaal eerst

### Build errors
- Check de GitHub Actions logs
- Verifieer dat alle dependencies correct zijn
- Controleer of TypeScript zonder errors compileert

### API endpoints werken niet
- Controleer of de API locatie correct is (`api`)
- Verifieer environment variables in Azure
- Check de function logs in Azure Portal

## Test Data Toevoegen

### Equipment toevoegen via SQL
```sql
INSERT INTO Equipment (CategoryId, ItemNumber, Name, Brand, Size, IsAvailable)
VALUES 
(1, 'TANK-001', '12L Duikfles', 'Luxfer', '12L', 1),
(2, 'SUIT-001', 'Droogpak', 'Santi', 'L', 1),
(3, 'BCD-001', 'Wing BCD', 'Halcyon', 'L', 1);
```

### Personen moeten al bestaan in de Persons tabel

## Monitoring

1. **Application Insights**
   - Optioneel te configureren voor monitoring
   - Voegt telemetrie en logging toe

2. **Logs bekijken**
   - Azure Portal → Static Web App → Functions
   - Bekijk real-time logs en errors

## Updates Deployen

1. Maak wijzigingen in de code
2. Commit en push naar `main` branch
3. GitHub Actions deployt automatisch
4. Wacht op deployment completion (5-10 min)
5. Test de nieuwe versie

## Kosten Optimalisatie

- **Free tier**: Voldoende voor development en kleine teams
- **Standard tier**: Voor productie gebruik met meer traffic
- SQL Database: Kies juiste tier based op gebruik
- Overweeg Serverless SQL voor variabel gebruik

## Beveiliging Best Practices

1. **Gebruik sterke wachtwoorden** voor database en email
2. **Roteer credentials** regelmatig
3. **Beperk database firewall** tot alleen noodzakelijke IP's
4. **Monitor toegang** via Azure logs
5. **Backup database** regelmatig

## Support

Voor vragen of problemen:
- Check de README.md voor algemene informatie
- Bekijk Azure Static Web Apps documentatie
- Raadpleeg Azure SQL documentatie
- Open een issue in de GitHub repository

## Handige Links

- [Azure Static Web Apps Docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure SQL Database Docs](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
