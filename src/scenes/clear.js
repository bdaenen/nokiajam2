import Phaser from 'phaser';
import font from '../font';
import bg from '../assets/bg.png';
import splash from '../assets/intro.png';
import fontUrl from '../assets/fonts/Gizmo199darkfont.png';

export default class Clear extends Phaser.Scene {
    constructor() {
        super({ key: 'clear', active: false });
    }
    create() {
        this.registry.set('cleared', this.registry.get('cleared') + 1);
        font.init(this);
        let overlay = this.add.image(0, 0, 'overlay');
        overlay.setOrigin(0, 0);
        overlay.setDepth(100000);
        let letters = font.drawText(8, 10, 'Quest cleared!');
        letters = letters.concat(
            font.drawText(8, 20, `Reward: ${this.registry.get('reward')}`)
        );
        letters = letters.concat(
            font.drawText(8, 30, `Survivors: ${this.registry.get('alive')}`)
        );
        let reward = Math.ceil(
            this.registry.get('reward') / this.registry.get('alive')
        );
        this.registry.set('gold', this.registry.get('gold') + reward);
        letters = letters.concat(font.drawText(8, 40, `Result: ${reward}`));
        letters.forEach((l, i) => l.setDepth(overlay.depth + i));

        this.input.keyboard.once('keydown', () => {
            letters = font.removeText(letters);
            letters = letters.concat(
                font.drawText(8, 12, `Total: ${this.registry.get('gold')}`)
            );
            letters = letters.concat(font.drawText(8, 36, `Goal: 3000`));
            letters = letters.concat(
                font.drawText(8, 24, `Stage: ${this.registry.get('cleared')}`)
            );
            letters.forEach((l, i) => l.setDepth(overlay.depth + i));
            this.input.keyboard.once('keydown', () => {
                this.scene.transition({
                    target: this.registry.get('gold') > 3000 ? 'win' : 'buy',
                    duration: 500,
                    moveBelow: true,
                    onUpdate: this.transitionOut,
                });
            });
        });
    }
    update() {}

    transitionOut(progress) {
        this.cameras.main.x = -84 * progress;
    }
}
