import Phaser from 'phaser';
import font from '../font';
import bg from '../assets/bg.png';
import splash from '../assets/intro.png';
import fontUrl from '../assets/fonts/Gizmo199darkfont.png';

export class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu', active: true });
    }
    preload() {
        this.load.image('bg', bg);
        this.load.image('splash', splash);
        this.load.spritesheet('nokia', fontUrl, {
            frameWidth: 5,
            frameHeight: 5,
        });
    }
    create() {
        font.init(this);
        this.registry.set('gold', 0);
        this.registry.set('cleared', 0);

        let splash = this.add.image(0, 0, 'splash');
        splash.setOrigin(0, 0);
        let graphics = this.add.graphics();
        graphics.setBlendMode(4);
        graphics.lineStyle(2, 0x43523d, 1.0);
        graphics.fillStyle(0xc7f0d8, 1.0);
        graphics.fillRect(12, 30, 60, 10);

        graphics.y = 30;
        let letters = font.drawText(16, 35 + 30, 'Press any #');
        let blinkInterval = null;
        this.all = letters.concat([graphics, splash]);
        this.tweens.add({
            targets: letters.concat([graphics]),
            y: '-=30',
            duration: 2000,
            delay: 1000,
            onComplete: () => {
                blinkInterval = setInterval(() => {
                    letters
                        .concat([graphics])
                        .forEach(t => (t.alpha = t.alpha === 1 ? 0 : 1));
                }, 750);

                this.input.keyboard.once('keydown', () => {
                    clearInterval(blinkInterval);
                    this.scene.transition({
                        target: 'dungeon',
                        duration: 500,
                        moveBelow: true,
                        onUpdate: this.transitionOut,
                    })
                });
            },
        });
    }
    update() {}
    transitionOut(progress) {
        this.all.forEach(i => i.x = (-84 * progress));
    }
}
