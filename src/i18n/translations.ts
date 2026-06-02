export type Lang = "cs" | "en";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

type Dict = Record<string, string>;

const cs: Dict = {
  // common
  "common.back": "Zpět",
  "common.cancel": "Zrušit",
  "common.save": "Uložit",
  "common.delete": "Smazat",
  "common.edit": "Upravit",
  "common.discard": "Zahodit",
  "common.loading": "Načítám…",
  "common.public": "Veřejný",
  "common.private": "Soukromý",
  "common.points": "b.",
  "common.seconds": "s",

  // nav
  "nav.quizzes": "Kvízy",
  "nav.play": "Hrát",
  "nav.history": "Historie",
  "nav.settings": "Nastavení",

  // logout
  "logout.button": "Odhlásit se",
  "logout.title": "Odhlásit se?",
  "logout.desc":
    "Po odhlášení se vrátíš na úvodní stránku a chráněné části aplikace už nepůjdou otevřít bez přihlášení.",
  "logout.confirm": "Odhlásit se",

  // home
  "home.tagline": "Živé kvízy pro všechny",
  "home.tab.join": "Hrát",
  "home.tab.login": "Přihlásit",
  "home.tab.register": "Registrace",
  "home.join.title": "Připoj se ke hře",
  "home.join.subtitle": "Zadej herní PIN",
  "home.join.cta": "Vstoupit",
  "home.login.title": "Vítej zpět",
  "home.login.subtitle": "Přihlas se ke svému účtu",
  "home.password": "Heslo",
  "home.login.cta": "Přihlásit se",
  "home.register.title": "Vytvoř účet",
  "home.register.subtitle": "Zdarma, bez kreditní karty",
  "home.name": "Jméno",
  "home.register.passwordPlaceholder": "Heslo (min. 8 znaků)",
  "home.register.cta": "Vytvořit účet",
  "home.google": "Pokračovat přes Google",
  "home.orGuest": "Nebo hraj bez účtu",
  "home.joinGame": "Připojit se ke hře",
  "home.err.login": "Špatný e-mail nebo heslo.",
  "home.err.register": "Registrace se nepodařila. Zkus jiný e-mail.",
  "home.err.google": "Přihlášení přes Google se nepodařilo.",

  // dashboard
  "dashboard.title": "Moje kvízy",
  "dashboard.new": "Nový kvíz",
  "dashboard.loading": "Načítám kvízy…",
  "dashboard.count": "Kvízy: {count}",
  "dashboard.empty.title": "Zatím žádné kvízy",
  "dashboard.empty.subtitle": "Vytvoř svůj první kvíz!",
  "dashboard.empty.cta": "Vytvořit kvíz",

  // history
  "history.title": "Historie her",
  "history.none": "Zatím nic neodehráno",
  "history.count": "Hry: {count}",
  "history.loading": "Načítám historii…",
  "history.empty.title": "Žádné odehrané hry",
  "history.empty.subtitle": "Zahostuj kvíz nebo se připoj do hry a objeví se tu.",
  "history.empty.cta": "Připojit se ke hře",
  "history.status.lobby": "V lobby",
  "history.status.live": "Probíhá",
  "history.status.finished": "Dokončeno",
  "history.hosted": "Hostoval jsi",
  "history.yourPlace": "Tvé místo",

  // join
  "join.headerTitle": "Hrát",
  "join.title": "Připojit se",
  "join.subtitle": "Vygeneruj si avatar a zadej přezdívku",
  "join.reroll": "Znovu hodit",
  "join.nickname": "Přezdívka",
  "join.nicknamePlaceholder": "SuperKvízař99",
  "join.pin": "PIN hry",
  "join.found": "Hra nalezena!",
  "join.cta": "Vstoupit do hry",
  "join.err.notFound": "Hra s tímto PINem neexistuje.",
  "join.err.notLobby": "Hra již probíhá nebo skončila.",
  "join.err.nickname": "Tahle přezdívka už je ve hře obsazená.",
  "join.err.generic": "Nepodařilo se připojit. Zkus to znovu.",

  // quiz form
  "quizForm.createTitle": "Nový kvíz",
  "quizForm.editTitle": "Upravit kvíz",
  "quizForm.name": "Název kvízu",
  "quizForm.namePlaceholder": "Např. Geografie Evropy",
  "quizForm.public": "Veřejný kvíz",
  "quizForm.addQuestion": "Přidat otázku",
  "quizForm.saveCreate": "Uložit kvíz",
  "quizForm.saveEdit": "Uložit změny",
  "quizForm.loading": "Načítám kvíz…",
  "quizForm.notFound": "Kvíz nenalezen.",
  "quizForm.backDashboard": "Zpět na kvízy",

  // question editor
  "qedit.questionN": "Otázka {n}",
  "qedit.remove": "Odstranit",
  "qedit.text": "Text otázky",
  "qedit.textPlaceholder": "Co je hlavní město Francie?",
  "qedit.type": "Typ",
  "qedit.type.quiz": "Výběr z možností",
  "qedit.type.true_false": "Pravda / Nepravda",
  "qedit.type.type_answer": "Psaná odpověď",
  "qedit.time": "Čas (s)",
  "qedit.options": "Možnosti (zaškrtni správnou)",
  "qedit.optionN": "Možnost {n}",
  "qedit.correctAnswer": "Správná odpověď",
  "qedit.typeAnswerPlaceholder": "Např. Paříž",

  // import
  "import.button": "Importovat otázky",
  "import.formats": " (JSON / CSV)",
  "import.help": "Návod k importu",
  "import.modalTitle": "Formát importu otázek",
  "import.err.empty": "Soubor neobsahuje žádné otázky",
  "import.err.read": "Chyba při čtení souboru: {msg}",
  "import.help.jsonDesc":
    "JSON soubor musí obsahovat pole otázek. Každá otázka má pole text, type, options, correctIndex, timeLimit a points.",
  "import.help.csvDesc":
    "CSV musí mít hlavičku níže. Podporuje se čárka i středník jako oddělovač.",
  "import.help.typesTitle": "Typy otázek",
  "import.help.typeQuiz": "quiz: přesně 4 možnosti, správná je podle indexu 0 až 3.",
  "import.help.typeTf": "true_false: přesně 2 možnosti, typicky Pravda / Nepravda.",
  "import.help.typeTa":
    "type_answer: správná textová odpověď je v první možnosti, correctIndex je 0.",

  // quiz detail
  "detail.title": "Detail kvízu",
  "detail.notFound": "Kvíz nenalezen.",
  "detail.backQuizzes": "Zpět na kvízy",
  "detail.stats.questions": "Otázky",
  "detail.stats.points": "Body",
  "detail.stats.time": "Čas",
  "detail.play": "Spustit hru",
  "detail.questionsHeading": "Otázky ({count})",
  "detail.answer": "Odpověď",
  "detail.correct": "Správně",
  "detail.delete.title": "Smazat kvíz?",
  "detail.delete.desc": "Kvíz „{title}“ bude trvale odstraněn. Tuto akci nejde vrátit zpět.",
  "detail.delete.confirm": "Smazat kvíz",
  "detail.editHint": "Klepni na otázku pro úpravu",
  "detail.save.title": "Uložit změny?",
  "detail.save.desc": "Úpravy otázky se uloží do kvízu.",
  "detail.cancel.title": "Zahodit změny?",
  "detail.cancel.desc": "Provedené úpravy otázky se neuloží.",
  "detail.removeQuestion.title": "Odstranit otázku?",
  "detail.removeQuestion.desc": "Otázka bude z kvízu trvale odstraněna.",

  // host
  "host.loading": "Načítám hru…",
  "host.question": "Otázka",
  "host.pin": "PIN hry",
  "host.end": "Ukončit hru",
  "host.waiting": "Čeká se na hráče",
  "host.connected": "Připojeno:",
  "host.start": "Spustit hru",
  "host.needPlayers": "Hru spustíš, až se připojí aspoň jeden hráč",
  "host.questionN": "Otázka {n}",
  "host.answered": "Odpovědělo {a} z {b} hráčů",
  "host.showResults": "Zobrazit výsledky",
  "host.questionResults": "Výsledky otázky {n}",
  "host.next": "Další otázka",
  "host.players": "Hráči ({n})",
  "host.end.title": "Ukončit hru?",
  "host.end.desc":
    "Hra se okamžitě označí jako dokončená a všichni hráči přejdou na výsledky. Aktuální otázka už nepůjde znovu otevřít.",
  "host.end.confirm": "Ukončit hru",

  // play
  "play.waitingGame": "Čekám na hru…",
  "play.waitingStart": "Čekám na spuštění hry…",
  "play.hostSoon": "Hostitel brzy začne",
  "play.timeUp": "Čas vypršel!",
  "play.correct": "Správně!",
  "play.wrong": "Špatně!",
  "play.correctAnswer": "Správná odpověď",
  "play.roundPoints": "Body za toto kolo",
  "play.totalScore": "Celkové skóre",
  "play.waitNext": "Čekám na další otázku…",
  "play.answerSent": "Odpověď odeslána.",
  "play.waitHost": "Čekám na výsledky od hostitele…",
  "play.typePlaceholder": "Napište odpověď…",
  "play.submit": "Odeslat odpověď",

  // results
  "results.loading": "Načítám výsledky…",
  "results.finalTitle": "Konečné pořadí",
  "results.title": "Výsledky",
  "results.yourPlace": "Jsi na {n}. místě!",
  "results.overall": "Celkové pořadí",
  "results.backHistory": "Zpět na historii",
  "results.home": "Domů",
  "results.again": "Hrát znovu",

  // leaderboard
  "lb.empty": "Zatím žádní hráči.",
  "lb.you": "(ty)",

  // settings
  "settings.title": "Nastavení",
  "settings.language": "Jazyk",
  "settings.language.desc": "Vyber jazyk aplikace.",

  // resume bar
  "resume.label": "Probíhá hra",
  "resume.lobby": "Hra čeká v lobby",
  "resume.cta": "Vrátit se",

  // toasts
  "toast.quizCreated": "Kvíz vytvořen",
  "toast.quizUpdated": "Změny uloženy",
  "toast.quizDeleted": "Kvíz smazán",
  "toast.questionSaved": "Otázka uložena",
  "toast.questionRemoved": "Otázka odstraněna",
  "toast.questionAdded": "Otázka přidána",
  "toast.gameStarted": "Hra spuštěna",
  "toast.gameEnded": "Hra ukončena",
  "toast.gameCancelled": "Hra zrušena",
  "toast.joined": "Připojeno do hry",
  "toast.imported": "Importováno otázek: {count}",
  "toast.loggedOut": "Odhlášeno",
  "toast.langChanged": "Jazyk změněn",
  "toast.error": "Něco se nepovedlo",
};

const en: Dict = {
  // common
  "common.back": "Back",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.discard": "Discard",
  "common.loading": "Loading…",
  "common.public": "Public",
  "common.private": "Private",
  "common.points": "pts",
  "common.seconds": "s",

  // nav
  "nav.quizzes": "Quizzes",
  "nav.play": "Play",
  "nav.history": "History",
  "nav.settings": "Settings",

  // logout
  "logout.button": "Log out",
  "logout.title": "Log out?",
  "logout.desc":
    "After logging out you'll return to the home screen and protected parts of the app won't be accessible without signing in.",
  "logout.confirm": "Log out",

  // home
  "home.tagline": "Live quizzes for everyone",
  "home.tab.join": "Play",
  "home.tab.login": "Sign in",
  "home.tab.register": "Sign up",
  "home.join.title": "Join a game",
  "home.join.subtitle": "Enter the game PIN",
  "home.join.cta": "Enter",
  "home.login.title": "Welcome back",
  "home.login.subtitle": "Sign in to your account",
  "home.password": "Password",
  "home.login.cta": "Sign in",
  "home.register.title": "Create account",
  "home.register.subtitle": "Free, no credit card",
  "home.name": "Name",
  "home.register.passwordPlaceholder": "Password (min. 8 chars)",
  "home.register.cta": "Create account",
  "home.google": "Continue with Google",
  "home.orGuest": "Or play without an account",
  "home.joinGame": "Join a game",
  "home.err.login": "Wrong email or password.",
  "home.err.register": "Sign up failed. Try a different email.",
  "home.err.google": "Google sign-in failed.",

  // dashboard
  "dashboard.title": "My quizzes",
  "dashboard.new": "New quiz",
  "dashboard.loading": "Loading quizzes…",
  "dashboard.count": "Quizzes: {count}",
  "dashboard.empty.title": "No quizzes yet",
  "dashboard.empty.subtitle": "Create your first quiz!",
  "dashboard.empty.cta": "Create a quiz",

  // history
  "history.title": "Game history",
  "history.none": "Nothing played yet",
  "history.count": "Games: {count}",
  "history.loading": "Loading history…",
  "history.empty.title": "No games played",
  "history.empty.subtitle": "Host a quiz or join a game and it'll show up here.",
  "history.empty.cta": "Join a game",
  "history.status.lobby": "In lobby",
  "history.status.live": "In progress",
  "history.status.finished": "Finished",
  "history.hosted": "You hosted",
  "history.yourPlace": "Your place",

  // join
  "join.headerTitle": "Play",
  "join.title": "Join",
  "join.subtitle": "Generate an avatar and enter a nickname",
  "join.reroll": "Reroll",
  "join.nickname": "Nickname",
  "join.nicknamePlaceholder": "QuizMaster99",
  "join.pin": "Game PIN",
  "join.found": "Game found!",
  "join.cta": "Join the game",
  "join.err.notFound": "No game with this PIN.",
  "join.err.notLobby": "The game is already in progress or finished.",
  "join.err.nickname": "That nickname is already taken.",
  "join.err.generic": "Couldn't join. Please try again.",

  // quiz form
  "quizForm.createTitle": "New quiz",
  "quizForm.editTitle": "Edit quiz",
  "quizForm.name": "Quiz name",
  "quizForm.namePlaceholder": "E.g. Geography of Europe",
  "quizForm.public": "Public quiz",
  "quizForm.addQuestion": "Add question",
  "quizForm.saveCreate": "Save quiz",
  "quizForm.saveEdit": "Save changes",
  "quizForm.loading": "Loading quiz…",
  "quizForm.notFound": "Quiz not found.",
  "quizForm.backDashboard": "Back to quizzes",

  // question editor
  "qedit.questionN": "Question {n}",
  "qedit.remove": "Remove",
  "qedit.text": "Question text",
  "qedit.textPlaceholder": "What is the capital of France?",
  "qedit.type": "Type",
  "qedit.type.quiz": "Multiple choice",
  "qedit.type.true_false": "True / False",
  "qedit.type.type_answer": "Typed answer",
  "qedit.time": "Time (s)",
  "qedit.options": "Options (check the correct one)",
  "qedit.optionN": "Option {n}",
  "qedit.correctAnswer": "Correct answer",
  "qedit.typeAnswerPlaceholder": "E.g. Paris",

  // import
  "import.button": "Import questions",
  "import.formats": " (JSON / CSV)",
  "import.help": "Import guide",
  "import.modalTitle": "Question import format",
  "import.err.empty": "The file contains no questions",
  "import.err.read": "Error reading file: {msg}",
  "import.help.jsonDesc":
    "The JSON file must contain an array of questions. Each question has the fields text, type, options, correctIndex, timeLimit and points.",
  "import.help.csvDesc":
    "The CSV must have the header below. Both comma and semicolon are supported as separators.",
  "import.help.typesTitle": "Question types",
  "import.help.typeQuiz": "quiz: exactly 4 options, the correct one by index 0 to 3.",
  "import.help.typeTf": "true_false: exactly 2 options, typically True / False.",
  "import.help.typeTa":
    "type_answer: the correct text answer is in the first option, correctIndex is 0.",

  // quiz detail
  "detail.title": "Quiz detail",
  "detail.notFound": "Quiz not found.",
  "detail.backQuizzes": "Back to quizzes",
  "detail.stats.questions": "Questions",
  "detail.stats.points": "Points",
  "detail.stats.time": "Time",
  "detail.play": "Start game",
  "detail.questionsHeading": "Questions ({count})",
  "detail.answer": "Answer",
  "detail.correct": "Correct",
  "detail.delete.title": "Delete quiz?",
  "detail.delete.desc":
    "The quiz “{title}” will be permanently deleted. This action cannot be undone.",
  "detail.delete.confirm": "Delete quiz",
  "detail.editHint": "Tap a question to edit it",
  "detail.save.title": "Save changes?",
  "detail.save.desc": "The question edits will be saved to the quiz.",
  "detail.cancel.title": "Discard changes?",
  "detail.cancel.desc": "Your edits to the question won't be saved.",
  "detail.removeQuestion.title": "Remove question?",
  "detail.removeQuestion.desc": "The question will be permanently removed from the quiz.",

  // host
  "host.loading": "Loading game…",
  "host.question": "Question",
  "host.pin": "Game PIN",
  "host.end": "End game",
  "host.waiting": "Waiting for players",
  "host.connected": "Connected:",
  "host.start": "Start game",
  "host.needPlayers": "You can start once at least one player joins",
  "host.questionN": "Question {n}",
  "host.answered": "{a} of {b} players answered",
  "host.showResults": "Show results",
  "host.questionResults": "Question {n} results",
  "host.next": "Next question",
  "host.players": "Players ({n})",
  "host.end.title": "End game?",
  "host.end.desc":
    "The game will immediately be marked as finished and all players will move to the results. The current question can't be reopened.",
  "host.end.confirm": "End game",

  // play
  "play.waitingGame": "Waiting for the game…",
  "play.waitingStart": "Waiting for the game to start…",
  "play.hostSoon": "The host will start soon",
  "play.timeUp": "Time's up!",
  "play.correct": "Correct!",
  "play.wrong": "Wrong!",
  "play.correctAnswer": "Correct answer",
  "play.roundPoints": "Points this round",
  "play.totalScore": "Total score",
  "play.waitNext": "Waiting for the next question…",
  "play.answerSent": "Answer sent.",
  "play.waitHost": "Waiting for results from the host…",
  "play.typePlaceholder": "Type your answer…",
  "play.submit": "Submit answer",

  // results
  "results.loading": "Loading results…",
  "results.finalTitle": "Final standings",
  "results.title": "Results",
  "results.yourPlace": "You finished in place {n}!",
  "results.overall": "Overall standings",
  "results.backHistory": "Back to history",
  "results.home": "Home",
  "results.again": "Play again",

  // leaderboard
  "lb.empty": "No players yet.",
  "lb.you": "(you)",

  // settings
  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.language.desc": "Choose the app language.",

  // resume bar
  "resume.label": "Game in progress",
  "resume.lobby": "Game waiting in lobby",
  "resume.cta": "Resume",

  // toasts
  "toast.quizCreated": "Quiz created",
  "toast.quizUpdated": "Changes saved",
  "toast.quizDeleted": "Quiz deleted",
  "toast.questionSaved": "Question saved",
  "toast.questionRemoved": "Question removed",
  "toast.questionAdded": "Question added",
  "toast.gameStarted": "Game started",
  "toast.gameEnded": "Game ended",
  "toast.gameCancelled": "Game cancelled",
  "toast.joined": "Joined the game",
  "toast.imported": "Imported {count} questions",
  "toast.loggedOut": "Logged out",
  "toast.langChanged": "Language changed",
  "toast.error": "Something went wrong",
};

export const translations: Record<Lang, Dict> = { cs, en };
