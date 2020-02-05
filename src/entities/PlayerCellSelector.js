import BaseEntity from './Base';
import font from "../font";

export default class PlayerCellSelector extends BaseEntity {
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
                    this.cornerText = font.drawText(25, 31, '1');
                    break;
                case 1:
                    this.cornerText = font.drawText(52, 31, '2');
                    break;
                case 2:
                    this.cornerText = font.drawText(80, 31, '3');
                    break;
            }
        }
        else {
            switch (this.gridPosition.x) {
                case 0:
                    this.cornerText = font.drawText(25, 44, '4');
                    break;
                case 1:
                    this.cornerText = font.drawText(52, 44, '5');
                    break;
                case 2:
                    this.cornerText = font.drawText(80, 44, '6');
                    break;
            }
        }
    }
}
