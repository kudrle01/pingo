# Pingo

Živé kvízy pro všechny. Kahoot klon jako semestrální práce.  
Stack: **React 18 + TypeScript + Convex + Tailwind CSS**

## Spuštění

```bash
npm install

# Terminál 1 – Convex backend (vyžaduje účet na convex.dev)
npx convex dev

# Terminál 2 – React frontend
npm run dev
```

> Při prvním `npx convex dev` tě průvodce provede přihlášením a vytvoří projekt.  
> Výsledný `VITE_CONVEX_URL` se automaticky zapíše do `.env.local`.

## Testy

```bash
npm run test          # jednorázový běh
npm run test:watch    # watch mód
npm run test:coverage # s pokrytím
```

## Struktura projektu

```
convex/          ← backend (Convex schema + queries + mutations)
src/
├── components/  ← UI komponenty
│   └── ui/      ← základní prvky (Button, Input, Modal)
├── hooks/       ← custom hooks (useGameSession, useCountdown, useScore)
├── lib/         ← pomocné funkce (scoring, pinGenerator, formatters)
├── pages/       ← stránky dle routeru
└── types/       ← TypeScript typy
```

## Path aliasy

| Alias | Cesta |
|---|---|
| `@/` | `src/` |
| `@convex/` | `convex/` |

## Routy

| Cesta | Stránka | Ochrana |
|---|---|---|
| `/` | Home – vstup PIN | – |
| `/dashboard` | Moje kvízy | přihlášení |
| `/create` | Nový kvíz | přihlášení |
| `/host/:gameId` | Hostitel hry | – |
| `/join` | Připojení (PIN + nick) | – |
| `/play/:gameId` | Hraní | – |
| `/results/:gameId` | Výsledky | – |

## Licence

[MIT](LICENSE)
