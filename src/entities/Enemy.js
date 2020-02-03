import BaseEntity from './Base';
import font from '../font';

const PLAYER_POS = {
    BOTTOM_LEFT: { x: 13, y: 42 },
    BOTTOM_CENTER: { x: 44, y: 42 },
    BOTTOM_RIGHT: { x: 72, y: 42 },
    TOP_LEFT: { x: 13, y: 30 },
    TOP_CENTER: { x: 44, y: 30 },
    TOP_RIGHT: { x: 72, y: 30 },
};
export default class EnemyEntity extends BaseEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('blob')
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
                realY = 6;
                break;
            case 1:
                realY = 18;
                break;
            default:
                throw new Error('Invalid Y pos');
        }

        this.setPosition(realX, realY);
    }

    drawCornerNumber() {
        this.clearCornerNumber();
        if (this.gridPosition.y === 0) {
            switch (this.gridPosition.x) {
                case 0:
                    this.cornerText = font.drawText(25, 7, '1');
                    break;
                case 1:
                    this.cornerText = font.drawText(53, 7, '2');
                    break;
                case 2:
                    this.cornerText = font.drawText(80, 7, '3');
                    break;
            }
        } else {
            switch (this.gridPosition.x) {
                case 0:
                    this.cornerText = font.drawText(25, 19, '4');
                    break;
                case 1:
                    this.cornerText = font.drawText(53, 19, '5');
                    break;
                case 2:
                    this.cornerText = font.drawText(80, 19, '6');
                    break;
            }
        }
    }
}
