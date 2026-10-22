# NIS2 Compliance Assistant

> A self-assessment tool that helps Swedish SMEs comply with the Swedish Cybersecurity Act (2025:1506), which implements the EU NIS2 directive. Built as my degree project for the .NET developer programme at Teknikhögskolan Gävle.

![CI](https://github.com/CodeAndersson/NIS2ComplianceAssistant/actions/workflows/ci.yml/badge.svg)

**Live demo:** [nis-2-compliance-assistant.vercel.app](https://nis-2-compliance-assistant.vercel.app/)

![Startsida](docs/screenshots/01-start.png)

## Varför verktyget finns

Den 15 januari 2026 trädde cybersäkerhetslagen (2025:1506) i kraft. Lagen omfattar nu arton sektorer i stället för sju, och uppskattningsvis 18 000 svenska företag berörs. Många av dem – särskilt medelstora företag i sektorer som omfattas för första gången – saknar vägledning för att översätta lagtexten till konkreta åtgärder.

De NIS2-verktyg som finns på marknaden är internationella, hänvisar inte till svensk lag och fungerar ofta som säljkanaler för konsulttjänster. Det här verktyget är byggt för svenska förhållanden och är fritt från lead-generering.

## Funktioner

1. **Omfattningsbedömning** – avgör utifrån sektor, antal anställda och omsättning om verksamheten är *väsentlig*, *viktig* eller inte omfattas, och visar vilken sektorsmyndighet som utövar tillsyn.
2. **Gap-analys** – 36 frågor fördelade på lagens tio säkerhetsåtgärdsområden (2 kap. 1 §), var och en kopplad till NIS2 art. 21.2 och ISO 27001:2022.
3. **Resultat och roadmap** – mognad per område och en prioriterad åtgärdsplan grupperad efter typ av insats: policy (0–4 veckor), process (1–3 månader) och teknik (3–12 månader).

4. **Spara och dela** *(valfritt)* – med backend igång kan bedömningen sparas på servern och delas via en länk, t.ex. med ledningsgruppen. Den kan tas bort från servern igen med ett klick.

**Lokalt först.** En gap-analys är i praktiken en karta över verksamhetens säkerhetsluckor, så svaren sparas som standard bara i webbläsaren (localStorage). Inget skickas till servern förrän användaren själv väljer att dela.

| Omfattningsbedömning | Gap-analys | Resultat | Dela |
|---|---|---|---|
| ![](docs/screenshots/02-omfattning.png) | ![](docs/screenshots/03-gap-analys.png) | ![](docs/screenshots/04-resultat.png) | ![](docs/screenshots/05-dela.png) |

## Teknik

| Del | Teknik |
|---|---|
| Frontend | React 19, TypeScript (strict), Vite |
| Backend | ASP.NET Core 8 (Web API), Entity Framework Core 8, SQLite |
| Tester | Vitest (frontend), xUnit + WebApplicationFactory (backend) |
| CI | GitHub Actions – typkontroll, tester och bygge av både frontend och backend |

```mermaid
flowchart LR
    U[Webbläsare] -->|React-app| F[Frontend]
    F -->|localStorage| L[(Lokalt utkast)]
    F -->|"REST /api/assessments<br/>(endast vid delning)"| A[ASP.NET Core API]
    A -->|EF Core| D[(SQLite)]
```

### Struktur

```
server/
├── src/Nis2.Api/
│   ├── Controllers/   # AssessmentsController – REST-endpoints
│   ├── Services/      # AssessmentService – affärslogik och databasåtkomst
│   ├── Domain/        # Entiteter, sektorer och ScopeAssessor (omfattningsbedömning)
│   ├── Contracts/     # Request/response-DTO:er och validering
│   └── Data/          # AppDbContext och EF Core-migreringar
└── tests/Nis2.Api.Tests/   # Enhetstester och integrationstester mot hela API:t
src/
├── data/          # Lagdata: sektorer, säkerhetsåtgärdsområden, incidentfrister
├── lib/           # Ren affärslogik (omfattning, poängsättning, lagring) + tester
├── hooks/         # useSparadBedomning – tillstånd som sparas i localStorage
├── components/    # En komponent per vy: Intro, Wizard, Gap, Resultat
├── styles/        # CSS
└── types.ts       # Gemensamma domäntyper
```

Affärslogiken (`bedomOmfattning`, `beraknaScore`, `prioriteradeLuckor`) är rena funktioner utan beroende till React, vilket gör dem enkla att testa. Omfattningsbedömningen finns även i backend (`ScopeAssessor`), så att klassificeringen av en sparad bedömning alltid räknas fram på servern i stället för att lita på data från klienten.

### API

| Metod | Endpoint | Beskrivning |
|---|---|---|
| `POST` | `/api/assessments` | Skapar en bedömning → `201 Created` |
| `GET` | `/api/assessments/{id}` | Hämtar en bedömning inklusive serverns omfattningsbedömning |
| `PUT` | `/api/assessments/{id}` | Ersätter uppgifter och svar |
| `DELETE` | `/api/assessments/{id}` | Tar bort en bedömning → `204 No Content` |
| `GET` | `/health` | Hälsokontroll (inkl. databas) |

Ogiltiga requests ger `400` med valideringsfel enligt RFC 7807. Swagger UI finns på `/swagger` i utvecklingsläge, och `Nis2.Api.http` innehåller färdiga anrop för Visual Studio/VS Code.

## Kom igång

### Endast frontend

Kräver Node.js 20 eller senare. Appen fungerar fullt ut utan backend.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run build      # typkontroll + produktionsbygge
```

### Med backend (spara och dela)

Kräver .NET 8 SDK.

```bash
cd server
dotnet run --project src/Nis2.Api   # http://localhost:5080, Swagger på /swagger
dotnet test                         # xUnit
```

Databasen (SQLite) skapas och migreras automatiskt vid start. Peka sedan frontend mot API:t:

```bash
cp .env.example .env.local          # innehåller VITE_API_URL=http://localhost:5080
npm run dev
```

## Avgränsningar

Verktyget är en prototyp framtagen som examensarbete. Bedömningen är förenklad (t.ex. omfattas vissa verksamheter oavsett storlek enligt MCFFS 2026:1) och ersätter inte juridisk eller teknisk rådgivning.

Delning bygger på svårgissade länkar (GUID) och har ingen inloggning – den som har länken kan läsa och uppdatera bedömningen. För produktion behövs autentisering, och SQLite bör bytas mot t.ex. SQL Server eller Azure SQL (byte av EF Core-provider och en ny migrering).

## Vidareutveckling

- [x] Backend i ASP.NET Core med EF Core för att spara och dela bedömningar
- [ ] Inloggning och behörighetsstyrning för delade bedömningar
- [ ] Driftsättning av API:t i Azure (App Service + Azure SQL)
- [ ] Export av resultat till PDF
- [ ] Koppling till IEC 62443 för OT-miljöer
- [ ] Användartester med riktiga organisationer

## Källor

Cybersäkerhetslagen (2025:1506), cybersäkerhetsförordningen (2025:1507), prop. 2025/26:28, MCFFS 2026:1 och NIS2-direktivet (EU 2022/2555). Fullständig källförteckning finns i examensarbetet.

## Författare

**Alexander Andersson** – .NET-utvecklare, Gävle
[LinkedIn](https://www.linkedin.com/in/alexander-andersson-dev) · [GitHub](https://github.com/CodeAndersson)
