const GAME_CONSTANTS = {
  GAME_HEIGHT: 900,
  GAME_WIDTH: 1600,
};

const PLAYER_CONSTANTS = {
  FROG_SIZE: 80,
  MAX_INJURY: 120,
  RIBBIT_REST: 60 * 5,  // 60 fps * number of seconds
  SPEED: 8,
  TONGUE_TIP_SIZE: 6,
};

const INSECT_CONSTANTS = {
  INSECT_SPEED: 5,
  INSECT_SIZE: 12,
};

const PLAYER_COLORS = [
  '#d00',
  '#09f',
  '#0f0',
  '#90f',
];

const RAINBOW = [
  '#f00',
  '#ff0',
  '#0f0',
  '#0ff',
  '#00f',
  '#f0f',
  '#b38b6d',
];

const DEV_MODE = false;

module.exports = {
  DEV_MODE,
  GAME_CONSTANTS,
  PLAYER_COLORS,
  PLAYER_CONSTANTS,
  INSECT_CONSTANTS,
  RAINBOW,
};
