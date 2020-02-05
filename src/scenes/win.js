import Phaser from 'phaser';
import font from '../font';
import bg from '../assets/bg.png';
import splash from '../assets/intro.png';
import fontUrl from '../assets/fonts/Gizmo199darkfont.png';

export default class Clear extends Phaser.Scene {
    constructor() {
        super({ key: 'win', active: false });
    }
    create() {
        font.init(this);
        let overlay = this.add.image(0, 0, 'overlay');
        overlay.setOrigin(0, 0);
        let letters = font.drawText(20, 12, 'You Win!');
        letters = letters.concat(font.drawText(20, 24, 'Death can'));
        letters = letters.concat(font.drawText(20, 36, 'pay his rent!'));
        letters.forEach((l, i) => l.setDepth(overlay.depth + i));
    }
    update() {}
}
