import EnemyEntity from "../Enemy";

export default class Bird extends EnemyEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('bird');
        this.maxHealth = 2;
    }
}
