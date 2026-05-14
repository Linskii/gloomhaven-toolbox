// Canonical Gloomhaven entity library — ships with the app.
// IDs are stable slugs derived from name, so saved games keep working across deploys.
// To add or change entries: edit this file, commit, and redeploy.
// To attach images: drop files into public/assets/entities/, add them to
// manifest.json, and set the `image` field below to the filename.

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function entry(name, type, image = null) {
  return { id: slug(name), name, type, image };
}

export const LIBRARY = [
  // ----- Starting Player Characters (base game, no spoilers) -----
  entry('Brute',       'PC'),
  entry('Tinkerer',    'PC'),
  entry('Spellweaver', 'PC'),
  entry('Scoundrel',   'PC'),
  entry('Cragheart',   'PC'),
  entry('Mindthief',   'PC'),

  // ----- Standard Monster Groups (base game, no bosses) -----
  entry('Ancient Artillery', 'EnemyGroup'),
  entry('Bandit Archer',     'EnemyGroup'),
  entry('Bandit Guard',      'EnemyGroup'),
  entry('Cave Bear',         'EnemyGroup'),
  entry('City Archer',       'EnemyGroup'),
  entry('City Guard',        'EnemyGroup'),
  entry('Cultist',           'EnemyGroup'),
  entry('Deep Terror',       'EnemyGroup'),
  entry('Earth Demon',       'EnemyGroup'),
  entry('Flame Demon',       'EnemyGroup'),
  entry('Forest Imp',        'EnemyGroup'),
  entry('Frost Demon',       'EnemyGroup'),
  entry('Giant Viper',       'EnemyGroup'),
  entry('Harrower Infester', 'EnemyGroup'),
  entry('Hound',             'EnemyGroup'),
  entry('Inox Archer',       'EnemyGroup'),
  entry('Inox Guard',        'EnemyGroup'),
  entry('Inox Shaman',       'EnemyGroup'),
  entry('Living Bones',      'EnemyGroup'),
  entry('Living Corpse',     'EnemyGroup'),
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
  entry('Wind Demon',        'EnemyGroup'),
];
