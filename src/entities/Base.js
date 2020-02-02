import font from '../font';

const PLAYER_POS = {
    BOTTOM_LEFT: { x: 13, y: 42 },
    BOTTOM_CENTER: { x: 44, y: 42 },
    BOTTOM_RIGHT: { x: 72, y: 42 },
    TOP_LEFT: { x: 13, y: 30 },
    TOP_CENTER: { x: 44, y: 30 },
    TOP_RIGHT: { x: 72, y: 30 },
};

export default class BaseEntity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.alive = true;
        this.gridPosition = {x, y};
        this.selectedBg = null;
        this.moveTo(this.gridPosition.x, this.gridPosition.y);
        this.setTexture('death');

        scene.add.existing(this);

        this._health = 3;
        this._maxHealth = 3;

        this.healthSprites = [];
        font.init(this.scene);
        this.healthText = font.drawText(
            this.x - 9,
            this.y + 2,
            this.health.toString()
        );
        this.heartSprite = this.scene.add.image(this.x - 8, this.y - 3, 'heart');
        this._selected = false;
    }

    get health() {
        return Math.max(0, this._health)
    }

    set health(health) {
        this._health = health;
        this.healthText.forEach(sprite => sprite.destroy());
        if (this._health <= 0) {
            this.kill()
        }
        else {
            this.healthText = font.drawText(this.x - 9, this.y + 2, health.toString());
        }

        return this;
        return this;
    }

    get selected() {
        return this._selected
    }

    set selected(selected) {
        this._selected = !!selected;

        if (this._selected) {
            this.selectedBg = this.scene.add.image(this.x-1, this.y-1, 'selected');
            this.selectedBg.setDepth(0);
            this.setDepth(1);
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
                realX = 44;
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

        this.gridPosition = {x, y};
        this.setPosition(realX, realY);
    }

    hurt(damage) {
        this.health = Math.max(0, this.health - damage);
    }
}
