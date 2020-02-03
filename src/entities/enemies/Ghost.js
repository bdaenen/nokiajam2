import EnemyEntity from "../Enemy";

export default class Ghost extends EnemyEntity {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.setTexture('ghost');
        this.maxHealth = 2;
    }
}
