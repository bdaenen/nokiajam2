import Phaser from 'phaser';
import BaseEntity from './Base';

export default class PartyMember extends BaseEntity {
    constructor(x, y, texture, frame) {
        super(x, y, texture, frame);
        this.setTexture('partymember');
        this.maxHealth = 3;
    }

    hurt(damage) {
        super.hurt(damage);
        if (this.health < 2) {
            this.setTexture('partymember_hurt')
        }
    }
}
