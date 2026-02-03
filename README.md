# Materiaal Uitleensysteem voor Duikvereniging

Een complete Azure Static Web App voor het beheren van materiaal uitleningen aan leden van een duikvereniging.

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Azure Functions (Node.js/TypeScript)
- **Database**: Azure SQL Server
- **Styling**: Tailwind CSS (responsief design)
- **Email**: Microsoft 365 / Office 365 (SMTP)
- **Hosting**: Azure Static Web Apps

## 📋 Functionaliteiten

### 1. Lid Zoeken
- Live zoekfunctie op naam, achternaam, en ID
- Toont relevante ledinformatie zoals brevet en groep
- Selecteer lid om materiaal te beheren

### 2. Materiaal Uitlenen
- Bekijk beschikbaar materiaal per categorie
- Multi-select functionaliteit voor meerdere items
- Card-based interface met alle materiaal details
- Automatische email notificaties

### 3. Materiaal Terugbrengen
- Overzicht van materiaal in bezit van geselecteerd lid
- Multi-select om meerdere items tegelijk terug te brengen
- Automatische beschikbaarheid updates

### 4. Email Notificaties
- Automatische emails naar lid en admin bij uitlenen
- Automatische emails bij terugbrengen
- Configureerbaar via environment variables

### 5. Saldo Tracking
- Read-only weergave van SaldoZuurstof en SaldoDuiken
- Geïntegreerd in lid informatie

## 🚀 Installatie & Setup

### Vereisten
- Node.js 18 of hoger
- Azure account met:
  - Azure Static Web Apps
  - Azure SQL Database
  - Azure Functions

### Lokale Ontwikkeling

1. **Clone de repository**
```bash
git clone https://github.com/revodiver/lidportaalv3.git
cd lidportaalv3
```

2. **Installeer dependencies**
```bash
# Frontend dependencies
npm install

# API dependencies
cd api
npm install
cd ..
```

3. **Database Setup**
```bash
# Voer het SQL script uit op je Azure SQL Database
# Zie database/schema.sql voor de volledige schema definitie
```

4. **Environment Variables**

Maak een `local.settings.json` bestand aan in de `api` directory:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DATABASE_SERVER": "your-server.database.windows.net",
    "DATABASE_NAME": "your-database-name",
    "DATABASE_USER": "your-username",
    "DATABASE_PASSWORD": "your-password",
    "MAIL_HOST": "smtp.office365.com",
    "MAIL_PORT": "587",
    "MAIL_USER": "your-email@domain.com",
    "MAIL_PASSWORD": "your-email-password",
    "ADMIN_EMAIL": "admin@domain.com"
  }
}
```

5. **Start de applicatie**
```bash
# Start frontend (in hoofdmap)
npm start

# Start API (in aparte terminal, in api directory)
cd api
npm run build
npm start
```

De applicatie draait nu op:
- Frontend: http://localhost:3000
- API: http://localhost:7071/api

## 📁 Projectstructuur

```
lidportaalv3/
├── api/                              # Azure Functions backend
│   ├── src/
│   │   ├── functions/               # API endpoints
│   │   │   ├── persons.ts           # Personen endpoints
│   │   │   ├── equipment.ts         # Materiaal endpoints
│   │   │   ├── equipmentCategories.ts
│   │   │   └── loans.ts             # Uitleningen endpoints
│   │   ├── services/
│   │   │   ├── database.ts          # SQL connectie
│   │   │   └── emailService.ts      # Email service
│   │   └── utils/
│   │       └── validation.ts        # Validatie functies
│   ├── package.json
│   ├── tsconfig.json
│   └── host.json
├── src/                             # React frontend
│   ├── components/                  # React componenten
│   │   ├── PersonSearch.tsx         # Lid zoeken
│   │   ├── PersonInfo.tsx           # Lid informatie
│   │   ├── EquipmentGrid.tsx        # Materiaal overzicht
│   │   ├── EquipmentCard.tsx        # Materiaal kaart
│   │   ├── CategoryFilter.tsx       # Categorie filter
│   │   ├── LoanManager.tsx          # Uitlenen beheer
│   │   ├── ReturnManager.tsx        # Terugbrengen beheer
│   │   ├── LoadingSpinner.tsx       # Laad indicator
│   │   └── ErrorMessage.tsx         # Foutmeldingen
│   ├── pages/
│   │   └── Home.tsx                 # Hoofdpagina
│   ├── hooks/                       # Custom React hooks
│   │   ├── usePersons.ts
│   │   ├── useEquipment.ts
│   │   └── useLoans.ts
│   ├── services/
│   │   └── api.ts                   # API communicatie
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── database/
│   └── schema.sql                   # Database schema
├── staticwebapp.config.json         # Azure SWA configuratie
├── package.json
├── tailwind.config.js
└── README.md
```

## 🗄️ Database Schema

### Tabellen

#### Persons (BESTAAND)
De Persons tabel bestaat al in de database en wordt gebruikt voor ledinformatie.

#### EquipmentCategories
- Id (INT, PRIMARY KEY, IDENTITY)
- Name (NVARCHAR(100))
- Description (NVARCHAR(500))
- SortOrder (INT)
- CreatedAt (DATETIME2)

#### Equipment
- Id (INT, PRIMARY KEY, IDENTITY)
- CategoryId (INT, FOREIGN KEY)
- ItemNumber (NVARCHAR(50), UNIQUE)
- Name (NVARCHAR(200))
- Brand, Size, Volume, Model (NVARCHAR)
- LastInspection, NextInspection (DATE)
- Notes (NVARCHAR(MAX))
- IsAvailable (BIT)
- CreatedAt, UpdatedAt (DATETIME2)

#### Loans
- Id (INT, PRIMARY KEY, IDENTITY)
- PersonId (INT, FOREIGN KEY)
- EquipmentId (INT, FOREIGN KEY)
- BorrowedAt (DATETIME2)
- ReturnedAt (DATETIME2, NULL)
- Notes (NVARCHAR(MAX))
- CreatedAt (DATETIME2)

## 🔌 API Endpoints

### Personen
- `GET /api/persons?search={query}` - Zoek personen
- `GET /api/persons/{id}` - Haal persoon op
- `GET /api/persons/{id}/loans` - Actieve leningen van persoon

### Materiaal
- `GET /api/equipment` - Alle materiaal
- `GET /api/equipment?available=true` - Beschikbaar materiaal
- `GET /api/equipment?categoryId={id}` - Materiaal per categorie

### Categorieën
- `GET /api/equipment-categories` - Alle categorieën

### Uitleningen
- `POST /api/loans` - Materiaal uitlenen
  - Body: `{ personId: number, equipmentIds: number[], notes?: string }`
- `PATCH /api/loans/return` - Materiaal terugbrengen
  - Body: `{ loanIds: number[] }`

## 🎨 UI/UX Features

- **Responsive Design**: Werkt op desktop, tablet en mobiel
- **Card-based Layout**: Duidelijke visuele weergave van materiaal
- **Multi-select**: Selecteer meerdere items tegelijk
- **Live Search**: Real-time zoeken met debouncing
- **Loading States**: Visuele feedback tijdens API calls
- **Error Handling**: Nederlandse foutmeldingen
- **Success Feedback**: Bevestigingen na acties

## 🚢 Deployment naar Azure

### Azure Static Web App Setup

1. **Maak een Azure Static Web App**
Via Azure Portal of CLI

2. **Configureer Environment Variables**
Voeg de volgende environment variables toe in Azure Portal onder Configuration:
- DATABASE_SERVER
- DATABASE_NAME
- DATABASE_USER
- DATABASE_PASSWORD
- MAIL_HOST
- MAIL_PORT
- MAIL_USER
- MAIL_PASSWORD
- ADMIN_EMAIL

3. **Deploy**
De applicatie wordt automatisch gedeployed bij elke push naar de main branch via GitHub Actions.

## 🔒 Beveiliging

- SQL injection preventie via parameterized queries
- CORS configuratie voor specifieke origins
- Environment variables voor gevoelige data
- Geen authenticatie vereist (zoals gevraagd)

## 📝 Gebruik

1. **Lid zoeken**: Type minimaal 2 karakters in het zoekveld
2. **Lid selecteren**: Klik op een lid in de zoekresultaten
3. **Materiaal uitlenen**: 
   - Filter optioneel op categorie
   - Klik op materiaal items om te selecteren
   - Klik op "Lenen" knop
4. **Materiaal terugbrengen**:
   - Bekijk materiaal in bezit van lid
   - Selecteer items om terug te brengen
   - Klik op "Terugbrengen" knop

## 🐛 Troubleshooting

### Database connectie problemen
- Controleer firewall regels in Azure SQL
- Verifieer connection string in environment variables
- Zorg dat Azure Functions IP toegang heeft

### Email verzending faalt
- Controleer SMTP credentials
- Verifieer email account configuratie
- Test SMTP connectie apart

### Build errors
```bash
# Clear cache en reinstall
rm -rf node_modules package-lock.json
npm install

cd api
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Bijdragen

Dit is een interne applicatie voor de duikvereniging. Neem contact op met de beheerder voor wijzigingen.

## 📄 Licentie

Proprietary - Duikvereniging

## 👤 Contact

Voor vragen of ondersteuning, neem contact op met de beheerder.
