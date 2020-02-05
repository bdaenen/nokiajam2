import BaseEntity from './Base';

export default class EnemyEntity extends BaseEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('blob')
        this.reward = 100;
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
                realY = 6;
                break;
            case 1:
                realY = 18;
                break;
            default:
                throw new Error('Invalid Y pos');
        }

        this.gridPosition = {x, y};
        window.tweening = true;
         if (this.heartSprite) {
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
    }
}
