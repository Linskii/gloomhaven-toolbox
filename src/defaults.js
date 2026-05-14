// Canonical Gloomhaven entity library — ships with the app.
// IDs are stable slugs derived from name, so saved games keep working across deploys.
// To add or change entries: edit this file, commit, and redeploy.
//
// To attach character art: drop image files into
// public/assets/entities/private/ (gitignored) and set the `image` field to
// `private/<slug>.<ext>`. For other devices, distribute via the in-app
// "Manage figures…" zip upload — files go to IndexedDB per-device.
// Entities without an image render a styled letter placeholder.

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function entry(name, type, image = null) {
  return { id: slug(name), name, type, image };
}

export const LIBRARY = [
  // ----- Starting Player Characters (base game, no spoilers) -----
  entry('Brute',       'PC', 'private/brute.png'),
  entry('Tinkerer',    'PC', 'private/tinkerer.png'),
  entry('Spellweaver', 'PC', 'private/spellweaver.png'),
  entry('Scoundrel',   'PC'),
  entry('Cragheart',   'PC'),
  entry('Mindthief',   'PC', 'private/mindthief.png'),

  // ----- Standard Monster Groups (base game, no bosses) -----
  entry('Ancient Artillery', 'EnemyGroup'),
  entry('Bandit Archer',     'EnemyGroup', 'private/bandit-archer.png'),
  entry('Bandit Guard',      'EnemyGroup'),
  entry('Cave Bear',         'EnemyGroup'),
  entry('City Archer',       'EnemyGroup'),
  entry('City Guard',        'EnemyGroup'),
  entry('Cultist',           'EnemyGroup', 'private/cultist.png'),
  entry('Deep Terror',       'EnemyGroup'),
  entry('Earth Demon',       'EnemyGroup', 'private/earth-demon.png'),
  entry('Flame Demon',       'EnemyGroup'),
  entry('Forest Imp',        'EnemyGroup'),
  entry('Frost Demon',       'EnemyGroup'),
  entry('Giant Viper',       'EnemyGroup'),
  entry('Harrower Infester', 'EnemyGroup'),
  entry('Hound',             'EnemyGroup'),
  entry('Inox Archer',       'EnemyGroup'),
  entry('Inox Guard',        'EnemyGroup'),
  entry('Inox Shaman',       'EnemyGroup'),
  entry('Living Bones',      'EnemyGroup', 'private/living-bones.png'),
  entry('Living Corpse',     'EnemyGroup', 'private/living-corpse.png'),
  entry('Living Spirit',     'EnemyGroup'),
  entry('Lurker',            'EnemyGroup'),
  entry('Night Demon',       'EnemyGroup'),
  entry('Ooze',              'EnemyGroup'),
  entry('Rending Drake',     'EnemyGroup'),
  entry('Savvas Icestorm',   'EnemyGroup'),
  entry('Savvas Lavaflow',   'EnemyGroup'),
  entry('Spitting Drake',    'EnemyGroup'),
  entry('Stone Golem',       'EnemyGroup'),
  entry('Sun Demon',         'EnemyGroup'),
  entry('Vermling Scout',    'EnemyGroup'),
  entry('Vermling Shaman',   'EnemyGroup'),
  entry('Wind Demon',        'EnemyGroup', 'private/wind-demon.png'),
];
