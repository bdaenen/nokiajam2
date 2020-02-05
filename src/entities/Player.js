import BaseEntity from './Base';

export default class Player extends BaseEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('death');
        this.maxHealth = 8;
        this.health = 4;
        this._power = 0;
        this.reapSprite = null;
    }

    get power() {
        return this._power
    }

    set power(p) {
        this._power = p;
        this.str = this._power + 1;
    }

    reap = (target) => {
        window.tweening = true;
        this.reapSprite = this.scene.add.sprite(target.x, target.y, 'scythe');
        this.reapSprite.rotation = -Math.PI/2;
        this.scene.tweens.add({
            targets: [this.reapSprite],
            rotation: `${Math.PI*3/4}`,
            ease: 'Quad.easeOut',
            duration: 1000,
            delay: 250,
            onComplete: () => {
                this.reapSprite.destroy();
                window.tweening = false;
                this.health += 1;
                this.setTexture(`death${this.power > 0 ? this.power : ''}`);
                target.setTexture('rip');
            }
        });
        target.hurt(this.power+1);
        this.power++;
    };

    kill() {
        super.kill();
        this.scene.gameOver = true;
    }
}
