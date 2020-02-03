import EnemyEntity from './Enemy';

export default class EnemyCellSelector extends EnemyEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setAlpha(0);
        this.maxHealth = 0;
    }
}
