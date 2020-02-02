import Phaser from "phaser";
import dungeonBg from "./assets/dungeon3x2.png";
import death from "./assets/death.png";
import DungeonScene from './scenes/dungeon'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 84,
  height: 48,
  backgroundColor: "#c7f0d8",
  pixelArt: true,
  scene: [DungeonScene]
};

const game = new Phaser.Game(config);