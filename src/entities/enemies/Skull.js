import EnemyEntity from "../Enemy";

export default class Skull extends EnemyEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('skull');
        this.maxHealth = 8;
        this.str = 2;
        this.reward = 600;
    }
}
