import Phaser from 'phaser';
import BaseEntity from './Base';

export default class PartyMember extends BaseEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('partymember');
        this.maxHealth = 3;
        this.hurt(2)
    }

    hurt(damage) {
        super.hurt(damage);
        if (this.health < 2) {
            this.setTexture('partymember_hurt')
        }
    }
}
