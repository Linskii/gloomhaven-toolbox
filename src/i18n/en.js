// English strings. Canonical source — every other language falls back to these
// when a key is missing.
//
// Adding a new language? Copy this file to e.g. `fr.js`, translate values,
// then register it in `src/i18n/index.js`.

export default {
  meta: { code: 'en', label: 'English' },

  ui: {
    'splash.subtitle':       'Initiative Tracker',
    'splash.startNew':       'Start a New Game',
    'splash.resumeRound':    (round) => `Resume Round ${round}`,
    'splash.abandonConfirm': 'Abandon the current game and start a new one?',

    'common.back':           '← Back',
    'common.cancel':         'Cancel',
    'common.close':          'Close',
    'common.none':           '(none)',
    'common.selected':       (n) => `${n} selected`,
    'common.filter':         'Filter…',
    'common.abandonShort':   '✕ Abandon',
    'common.abandonConfirm': 'Abandon this game and return to the splash?',

    'setup.title':           'Choose Your Scenario',
    'setup.colPCs':          'Player Characters',
    'setup.colEnemies':      'Enemies & Allies',
    'setup.start':           'Start Game →',

    'init.title':            (round) => `Round ${round} — Initiative`,
    'init.subtitle':         'Tap entities in the order they act this round. Skip anyone resting.',
    'init.footerHint':       'Tap in order to set initiative',
    'init.start':            'Start Round →',

    'carousel.brand':        'Gloomhaven',
    'carousel.editRound':    'Edit Round',
    'carousel.editRoundTip': 'Edit round (spawn / remove)',
    'carousel.endRound':     'End Round',
    'carousel.round':        (round) => `Round ${round}`,
    'carousel.turn':         (idx, name) => `Turn ${idx}: ${name}`,
    'carousel.hint':         'Swipe / drag • Use ← → keys',

    'edit.title':            'Edit Round',
    'edit.hint':             'Select a candidate on the right, then choose an insert slot on the left. Use ✕ to remove an entity from the round.',
    'edit.currentOrder':     'Current Order',
    'edit.pool':             'Pool — Not in Round',
    'edit.insertHere':       'Insert here',
    'edit.now':              '• now',
    'edit.empty':            '(no entities in this round)',
    'edit.poolEmpty':        'Every entity in the scenario pool is already in the round.',
    'edit.selected':         'Selected',
    'edit.removeTitle':      'Remove from round',

    'end.title':             (round) => `End of Round ${round}`,
    'end.lead':              'Don’t forget to …',
    'end.back':              'Back',
    'end.next':              'Begin Next Round →',
    'end.reminder1':         '… decay elements',
    'end.reminder2':         '… reshuffle attack modifier decks if ×2 / null was drawn',

    'type.PC':               'Player Character',
    'type.EnemyGroup':       'Enemy Group',
    'type.Ally':             'Ally',
  },

  // Per-entity name overrides keyed by entity id (slug). English uses the
  // canonical English names from defaults.js, so this stays empty.
  entities: {},
};
