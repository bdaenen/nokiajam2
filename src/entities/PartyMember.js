import BaseEntity from './Base';

export default class PartyMember extends BaseEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('partymember');
        this.maxHealth = 3;
    }

    kill() {
        this.heartSprite.destroy();
        this.alive = false;
    }
    hurt(damage) {
        if (this.health-damage < 2) {
            this.setTexture('partymember_hurt')
        }
        return super.hurt(damage);
    }
}
