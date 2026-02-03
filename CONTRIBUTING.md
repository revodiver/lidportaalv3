# Materiaal Uitleensysteem - Ontwikkelaar Documentatie

## Lokale Development Setup

### 1. Repository Klonen
```bash
git clone https://github.com/revodiver/lidportaalv3.git
cd lidportaalv3
```

### 2. Dependencies Installeren

**Frontend:**
```bash
npm install
```

**Backend API:**
```bash
cd api
npm install
cd ..
```

### 3. Database Configureren

1. Maak een Azure SQL Database aan of gebruik een lokale SQL Server
2. Voer `/database/schema.sql` uit op de database
3. Voeg testdata toe (optioneel):

```sql
-- Voorbeeld testdata
INSERT INTO Equipment (CategoryId, ItemNumber, Name, Brand, Size, IsAvailable)
VALUES 
(1, 'TANK-001', '12L Duikfles', 'Luxfer', '12L', 1),
(1, 'TANK-002', '15L Duikfles', 'Faber', '15L', 1),
(2, 'SUIT-001', 'Droogpak', 'Santi', 'L', 1);
```

### 4. Environment Variables

Kopieer het template en pas aan:
```bash
cd api
cp local.settings.json.template local.settings.json
```

Bewerk `local.settings.json` met jouw database en email configuratie.

### 5. Applicatie Starten

**Terminal 1 - Frontend:**
```bash
npm start
```
Dit start de React app op http://localhost:3000

**Terminal 2 - Backend API:**
```bash
cd api
npm run build
npm start
```
Dit start de Azure Functions op http://localhost:7071

## Project Structuur Details

### Frontend (`/src`)

```
src/
├── components/          # React componenten
│   ├── PersonSearch.tsx      # Live zoeken met debouncing
│   ├── PersonInfo.tsx        # Lid informatie display
│   ├── EquipmentCard.tsx     # Individuele materiaal kaart
│   ├── EquipmentGrid.tsx     # Grid layout voor materiaal
│   ├── CategoryFilter.tsx    # Categorie filter buttons
│   ├── LoanManager.tsx       # Uitlenen logica en UI
│   ├── ReturnManager.tsx     # Terugbrengen logica en UI
│   ├── LoadingSpinner.tsx    # Loading state
│   └── ErrorMessage.tsx      # Error display
├── hooks/               # Custom React hooks
│   ├── usePersons.ts         # Personen management
│   ├── useEquipment.ts       # Materiaal management
│   └── useLoans.ts           # Uitleningen management
├── services/            # API communicatie
│   └── api.ts                # Axios API client
├── types/               # TypeScript definities
│   └── index.ts              # Alle interfaces
└── pages/               # Pagina componenten
    └── Home.tsx              # Hoofd pagina
```

### Backend (`/api/src`)

```
api/src/
├── functions/           # Azure Functions endpoints
│   ├── persons.ts            # GET /api/persons
│   ├── equipment.ts          # GET /api/equipment
│   ├── equipmentCategories.ts # GET /api/equipment-categories
│   └── loans.ts              # POST/PATCH /api/loans
├── services/            # Business logica
│   ├── database.ts           # SQL connectie en queries
│   └── emailService.ts       # Email verzending
└── utils/               # Helper functies
    └── validation.ts         # Input validatie
```

## Code Conventies

### TypeScript
- Gebruik strict type checking
- Definieer interfaces voor alle data structures
- Gebruik async/await voor asynchrone operaties
- Geen `any` types, gebruik specifieke types

### React
- Functionele componenten met hooks
- Props interfaces voor alle componenten
- Gebruik memo voor performance waar nodig
- Destructure props in functie parameters

### Styling
- Tailwind CSS utility classes
- Responsive design (mobile-first)
- Consistente spacing en kleuren
- Dark mode niet geïmplementeerd (toekomstige feature)

### Naming
- Componenten: PascalCase (bijv. `PersonSearch`)
- Functions/Variables: camelCase (bijv. `searchPersons`)
- Constants: UPPER_SNAKE_CASE (bijv. `API_BASE_URL`)
- Files: Match component/export name

## API Endpoints Documentatie

### Personen

**GET /api/persons?search={query}**
- Zoekt personen op naam, achternaam, ID
- Returns: `Person[]`
- Voorbeeld: `/api/persons?search=John`

**GET /api/persons/{id}**
- Haalt specifieke persoon op
- Returns: `Person`

**GET /api/persons/{id}/loans**
- Actieve leningen van persoon
- Returns: `Loan[]` (met Equipment details)

### Materiaal

**GET /api/equipment**
- Alle materiaal
- Returns: `Equipment[]`

**GET /api/equipment?available=true**
- Alleen beschikbaar materiaal
- Returns: `Equipment[]`

**GET /api/equipment?categoryId={id}**
- Materiaal per categorie
- Returns: `Equipment[]`

### Categorieën

**GET /api/equipment-categories**
- Alle categorieën
- Returns: `EquipmentCategory[]`

### Uitleningen

**POST /api/loans**
```json
{
  "personId": 1,
  "equipmentIds": [1, 2, 3],
  "notes": "Optionele notitie"
}
```
- Leent materiaal uit
- Returns: `{ loanIds: number[] }`
- Stuurt emails naar lid en admin

**PATCH /api/loans/return**
```json
{
  "loanIds": [1, 2, 3]
}
```
- Brengt materiaal terug
- Returns: `{ returnedCount: number }`
- Stuurt emails naar lid en admin

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
Nog niet geïmplementeerd. Overwegingen voor toekomstige implementatie:
- Cypress of Playwright
- Test alle user flows
- Mock API responses

### Manual Testing Checklist
- [ ] Zoeken werkt met verschillende queries
- [ ] Lid selecteren toont correcte informatie
- [ ] Categorie filter werkt
- [ ] Multi-select materiaal werkt
- [ ] Uitlenen updates beschikbaarheid
- [ ] Terugbrengen updates beschikbaarheid
- [ ] Emails worden verzonden
- [ ] Error handling werkt
- [ ] Loading states worden getoond
- [ ] Responsive design op mobile

## Debugging

### Frontend Debugging
- React DevTools browser extensie
- Console logs in browser
- Redux DevTools (niet gebruikt, maar kan toegevoegd worden)

### Backend Debugging
- Azure Functions Core Tools logs
- SQL Profiler voor database queries
- Email test tools (zoals Mailtrap)

### Common Issues

**CORS Errors:**
- Check `staticwebapp.config.json`
- Verify API location in config

**Database Timeout:**
- Check connection pool settings
- Verify firewall rules
- Check query performance

**Email Fails:**
- Verify SMTP settings
- Check credential validity
- Test with simple email first

## Performance Optimalisatie

### Frontend
- Code splitting per route (future)
- Lazy loading images
- Debounced search (geïmplementeerd)
- Memoized components waar nodig

### Backend
- Connection pooling (geïmplementeerd)
- Indexed database queries (geïmplementeerd)
- Cached category data (future)

### Database
- Indexes op foreign keys (geïmplementeerd)
- Indexes op search columns (future)
- Query optimization

## Security

### Frontend
- Input sanitization
- XSS prevention via React
- HTTPS only in productie

### Backend
- Parameterized SQL queries (SQL injection preventie)
- Input validation
- Error message sanitization
- Rate limiting (future)

### Database
- Minimal privileges voor app user
- Encrypted connections
- Regular backups

## Toekomstige Features

### Prioriteit Hoog
- [ ] Authenticatie en autorisatie
- [ ] Gebruikers rollen (admin, lid, etc.)
- [ ] Materiaal geschiedenis per item
- [ ] Rapportage en statistieken

### Prioriteit Middel
- [ ] Materiaal reserveringen
- [ ] Herinneringen voor terugbrengen
- [ ] Materiaal onderhoud tracking
- [ ] QR code scanning

### Prioriteit Laag
- [ ] Mobile app
- [ ] Dark mode
- [ ] Export naar Excel
- [ ] Dashboard met grafieken

## Contributing

1. Maak een feature branch: `git checkout -b feature/naam`
2. Maak je wijzigingen
3. Test lokaal
4. Commit met duidelijke messages
5. Push en maak een Pull Request
6. Wacht op code review

## Code Review Checklist

- [ ] Code volgt TypeScript best practices
- [ ] Alle types zijn correct gedefinieerd
- [ ] Error handling is aanwezig
- [ ] Code is getest
- [ ] Comments zijn toegevoegd waar nodig
- [ ] Geen console.logs in productie code
- [ ] Performance is overwogen
- [ ] Security is overwogen

## Vragen?

Voor vragen of ondersteuning, open een issue in GitHub of neem contact op met de maintainer.
