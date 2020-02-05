import EnemyEntity from "../Enemy";

export default class Blob extends EnemyEntity {
    constructor(x, y, texture, frame) {
        super(x, y, texture, frame);
        this.setTexture('blob');
        this.maxHealth = 2;
        this.reward = 150;
    }
}
