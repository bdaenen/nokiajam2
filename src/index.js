import Phaser from "phaser";
import dungeonBg from "./assets/dungeon3x2.png";
import death from "./assets/death.png";
import { Menu } from './scenes/menu';
import DungeonScene from './scenes/dungeon'
import Buy from './scenes/buy'
import clear from './scenes/clear'
import win from './scenes/win'


(function () {
  'use strict';
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 84,
    height: 48,
    backgroundColor: "#c7f0d8",
    pixelArt: true,
    scene: [Menu, DungeonScene, clear, Buy, win]
  };

  const game = new Phaser.Game(config);
}());
