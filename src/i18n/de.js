// Deutsche Übersetzungen.
// Wesensnamen orientieren sich an der offiziellen Feuerland-Spiele-Ausgabe
// von Gloomhaven. Hauptquelle ist die deutsche FAQ von Feuerland Spiele
// (Wandelndes Skelett, Pirscher, Sonnendämon, Antike Artillerie,
// Inox-Wächter, Banditen-Wächter, Felsenherz, Spruchweberin, Tüftler,
// Barbar, Schurkin, Gedankendiebin etc.); für Monster, die in der FAQ
// nicht namentlich vorkommen, wurde die deutsche Lokalisierung der
// digitalen Steam-Ausgabe als Fallback genutzt (Ratzenspäher, Reißdrake,
// Speidrake, Waldwicht, Dunkelwolf, Schwarmling-Kontagion etc.).
// Wenn dir etwas unrund vorkommt, einfach unten unter `entities` anpassen.

export default {
  meta: { code: 'de', label: 'Deutsch' },

  ui: {
    'splash.subtitle':       'Initiative-Anzeiger',
    'splash.startNew':       'Neues Spiel starten',
    'splash.resumeRound':    (round) => `Runde ${round} fortsetzen`,
    'splash.abandonConfirm': 'Aktuelles Spiel verwerfen und neu starten?',
    'splash.manageFigures':  'Figuren verwalten…',

    'settings.title':        'Figuren verwalten',
    'settings.hint':         'ZIP-Datei mit PNG/WebP/JPG hochladen, deren Dateinamen den Entity-Kürzeln entsprechen (z. B. brute.png, bandit-archer.png). Bilder werden nur auf diesem Gerät gespeichert.',
    'settings.upload':       'ZIP hochladen',
    'settings.clear':        'Alle löschen',
    'settings.clearConfirm': 'Alle hochgeladenen Figuren von diesem Gerät entfernen?',
    'settings.cleared':      'Alle Figuren von diesem Gerät entfernt.',
    'settings.unpacking':    'ZIP wird entpackt…',
    'settings.imported':     (n) => `${n} Figur${n === 1 ? '' : 'en'} importiert`,
    'settings.unknown':      (n) => `${n} unbekannte${n === 1 ? 's' : ''} Kürzel`,
    'settings.skipped':      (n) => `${n} Nicht-Bild-Datei${n === 1 ? '' : 'en'} übersprungen`,
    'settings.errorPrefix':  'Konnte nicht laden',
    'settings.errorRead':    'ZIP-Datei konnte nicht gelesen werden.',
    'settings.none':         'Noch keine Figuren auf diesem Gerät hochgeladen.',
    'settings.loaded':       (n) => `${n} Figur${n === 1 ? '' : 'en'} auf diesem Gerät geladen:`,

    'common.back':           '← Zurück',
    'common.cancel':         'Abbrechen',
    'common.close':          'Schließen',
    'common.none':           '(keine)',
    'common.selected':       (n) => `${n} ausgewählt`,
    'common.filter':         'Filtern…',
    'common.abandonShort':   '✕ Beenden',
    'common.abandonConfirm': 'Spiel beenden und zur Startseite zurück?',

    'setup.title':           'Szenario wählen',
    'setup.colPCs':          'Spielercharaktere',
    'setup.colEnemies':      'Gegner & Verbündete',
    'setup.start':           'Spiel starten →',
    'setup.renamePlaceholder': (classLabel) => `${classLabel} umbenennen (optional)`,

    'init.title':            (round) => `Runde ${round} — Initiative`,
    'init.subtitle':         'Wesen in der Reihenfolge ihres Zugs antippen. Wer pausiert, bleibt ungetippt.',
    'init.footerHint':       'Tippreihenfolge bestimmt die Initiative',
    'init.start':            'Runde beginnen →',

    'carousel.brand':        'Gloomhaven',
    'carousel.editRound':    'Runde bearbeiten',
    'carousel.editRoundTip': 'Runde bearbeiten (hinzufügen / entfernen)',
    'carousel.endRound':     'Runde beenden',
    'carousel.round':        (round) => `Runde ${round}`,
    'carousel.turn':         (idx, name) => `Zug ${idx}: ${name}`,
    'carousel.hint':         'Wischen / ziehen • ← → Tasten',

    'edit.title':            'Runde bearbeiten',
    'edit.hint':             'Rechts einen Kandidaten auswählen, dann links auf einen Einfüge-Slot tippen. Mit ✕ ein Wesen aus der Runde entfernen.',
    'edit.currentOrder':     'Aktuelle Reihenfolge',
    'edit.pool':             'Reserve — nicht in der Runde',
    'edit.insertHere':       'Hier einfügen',
    'edit.now':              '• jetzt',
    'edit.empty':            '(keine Wesen in dieser Runde)',
    'edit.poolEmpty':        'Alle Wesen des Szenarios sind bereits in der Runde.',
    'edit.selected':         'Ausgewählt',
    'edit.removeTitle':      'Aus der Runde entfernen',

    'end.title':             (round) => `Ende von Runde ${round}`,
    'end.lead':              'Nicht vergessen …',
    'end.back':              'Zurück',
    'end.next':              'Nächste Runde →',
    'end.reminder1':         '… Elemente abklingen lassen',
    'end.reminder2':         '… Angriffsmodifikator-Decks neu mischen, falls ×2 / Null gezogen wurde',

    'type.PC':               'Spielercharakter',
    'type.EnemyGroup':       'Gegnergruppe',
    'type.Ally':             'Verbündeter',
  },

  // Wesensnamen — keys are entity ids (slugs) from defaults.js.
  entities: {
    // Spielercharaktere (Feuerland-Spiele-Ausgabe)
    'brute':              'Barbar',
    'tinkerer':           'Tüftler',
    'spellweaver':        'Spruchweberin',
    'scoundrel':          'Schurkin',
    'cragheart':          'Felsenherz',
    'mindthief':          'Gedankendiebin',

    // Gegnergruppen
    'ancient-artillery':  'Antike Artillerie',
    'bandit-archer':      'Banditen-Schütze',
    'bandit-guard':       'Banditen-Wächter',
    'cave-bear':          'Höhlenbär',
    'city-archer':        'Stadt-Schütze',
    'city-guard':         'Stadt-Wache',
    'cultist':            'Kultist',
    'deep-terror':        'Tiefenschreck',
    'earth-demon':        'Erddämon',
    'flame-demon':        'Flammendämon',
    'forest-imp':         'Waldwicht',
    'frost-demon':        'Frostdämon',
    'giant-viper':        'Riesenviper',
    'harrower-infester':  'Schwarmling-Kontagion',
    'hound':              'Dunkelwolf',
    'inox-archer':        'Inox-Schütze',
    'inox-guard':         'Inox-Wächter',
    'inox-shaman':        'Inox-Schamane',
    'living-bones':       'Wandelndes Skelett',
    'living-corpse':      'Wandelnde Leiche',
    'living-spirit':      'Lebender Geist',
    'lurker':             'Pirscher',
    'night-demon':        'Nachtdämon',
    'ooze':               'Schleim',
    'rending-drake':      'Reißdrake',
    'savvas-icestorm':    'Savvas Eissturm',
    'savvas-lavaflow':    'Savvas Lavastrom',
    'spitting-drake':     'Speidrake',
    'stone-golem':        'Steingolem',
    'sun-demon':          'Sonnendämon',
    'vermling-scout':     'Ratzenspäher',
    'vermling-shaman':    'Ratzenschamane',
    'wind-demon':         'Winddämon',
  },
};
