import BaseEntity from './Base';

export default class PlayerCellSelector extends BaseEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setAlpha(0);
        this.maxHealth = 0;
    }
}
