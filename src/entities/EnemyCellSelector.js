import EnemyEntity from './Enemy';
import font from "../font";

export default class EnemyCellSelector extends EnemyEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setAlpha(0);
        this.heartSprite.destroy();
        this.healthSprites && this.healthSprites.forEach((p) => p.destroy());
        this._isSelectable = false;
    }
    get health() {
        return 1;
    }

    set health(health) {
       return this;
    }

    get isSelectable() {
        return this._isSelectable
    }

    set isSelectable(isSelectable) {
        isSelectable = !!isSelectable;
        this._isSelectable && !isSelectable && this.clearCornerNumber();
        !this._isSelectable && isSelectable && this.drawCornerNumber();
        this._isSelectable = isSelectable;
    }

    kill() {
    }

    clearCornerNumber() {
        this.cornerText.length && this.cornerText[0].destroy();
        this.cornerText.length = 0;
    }

     drawCornerNumber() {
        this.clearCornerNumber();
        if (this.gridPosition.y === 0) {
            switch (this.gridPosition.x) {
                case 0:
                    this.cornerText = font.drawText(25, 7, '1');
                    break;
                case 1:
                    this.cornerText = font.drawText(52, 7, '2');
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
                    this.cornerText = font.drawText(52, 19, '5');
                    break;
                case 2:
                    this.cornerText = font.drawText(80, 19, '6');
                    break;
            }
        }
    }
}
