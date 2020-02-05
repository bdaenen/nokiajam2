import font from '../font';

export default class BaseEntity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.alive = true;
        this.gridPosition = {x, y};
        this.selectedBg = null;
        this.moveTo(this.gridPosition.x, this.gridPosition.y);
        this.setTexture('death');
        this.cornerText = [];
        this.str = 1;
        this.attackSprite = null;
        this._acted = false;

        scene.add.existing(this);

        this._health = 3;
        this._maxHealth = 3;

        this.healthSprites = [];
        font.init(this.scene);
        this.heartSprite = this.scene.add.image(this.x - 9, this.y - 3, 'heart');
        this.updateHealthSprite();
        this._selected = false;
    }

    updateHealthSprite() {
        this.heartSprite.setPosition(this.x - 9, this.y - 3);
        this.healthSprites.forEach(hs => hs.destroy());
        this.healthSprites.length = 0;
        for (let i = 0; i < this.health; i++) {
            let x = this.heartSprite.x-2+(i%4*2);
            let y = this.heartSprite.y+4 + (Math.floor(i/4) * 2);
            this.healthSprites.push(this.scene.add.image(x, y, 'health'))
        }
    }

    get acted() {
        if (this.alive) {
            return this._acted;
        }
        return true;
    }

    set acted(acted) {
        this._acted = acted;
    }

    get health() {
        return Math.max(0, this._health)
    }

    set health(health) {
        this._health = Math.min(this.maxHealth, health);
        if (this._health <= 0) {
            this.kill()
        }

        this.updateHealthSprite();
        return this;
    }

    get selected() {
        return this._selected
    }

    set selected(selected) {
        this._selected = !!selected;

        if (this._selected) {
            /*this.selectedBg = this.scene.add.image(this.x-1, this.y-1, 'selected');
            this.selectedBg.setDepth(0);
            this.setDepth(1);*/
        }

        return this;
    }

    get maxHealth() {
        return this._maxHealth
    }

    set maxHealth(maxHealth) {
        this._maxHealth = Math.max(0, maxHealth);
        this.health = Math.max(0, maxHealth);
        return this;
    }

    kill() {
        this.setTexture('rip');
        this.heartSprite.destroy();
        this.alive = false;
    }

    moveTo(x, y) {
        let realX = 0;
        let realY = 0;
        switch (x) {
            case 0:
                realX = 13;
                break;
            case 1:
                realX = 43;
                break;
            case 2:
                realX = 72;
                break;
            default:
                throw new Error('Invalid X pos');
        }

        switch (y) {
            case 0:
                realY = 30;
                break;
            case 1:
                realY = 42;
                break;
            default:
                throw new Error('Invalid Y pos');
        }
        if (this.heartSprite) {
            window.tweening = true;
            this.scene.tweens.add({
                targets: [this],
                x: realX,
                y: realY,
                duration: 500,
                onUpdate: () => {
                    this.updateHealthSprite();
                },
                onComplete: () => {
                    window.tweening = false;
                }
            });
        }
        else {
            this.setPosition(realX, realY);
        }
        this.gridPosition = {x, y};
    }

    hurt(damage) {
        this.health = Math.max(0, this.health - damage);
        return this;
    }

    attack(target) {
        this.attackSprite = this.scene.add.sprite(this.x, this.y, 'sword');
        this.attackSprite.rotation = Phaser.Math.Angle.BetweenPoints(this.attackSprite, target) + Math.PI/2;
        window.tweening = true;
        this.scene.tweens.add({
            targets: this.attackSprite,
            x: target.x,
            y: target.y,
            duration: 250,
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                window.tweening = false;
                this.attackSprite.destroy();
                this.attackSprite = null;
                target.hurt(this.str);
            }
        });
    }
}
