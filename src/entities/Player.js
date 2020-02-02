import Phaser from 'phaser';
import BaseEntity from './Base';

export default class Player extends BaseEntity {
    power = 0;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.setTexture('death');
        this.maxHealth = 4;
    }

    reap(target) {
        target.destroy();
        this.power++;
        this.setTexture(`death${this.power > 0 ? this.power : ''}`);
    }
}
