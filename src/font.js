import font from './assets/fonts/Gizmo199darkfont.png';
const fontOrder = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
export default {
    init(scene) {
        this.scene = scene;
    },
    addLetter(x, y, letter) {
        let i = fontOrder.indexOf(letter);
        if (!i) {
            throw new Error(`"${letter}" does not exist within the font.`);
        }
        return this.scene.add.image(x, y, 'nokia', i);
    },
    drawText(x, y, text) {
        text = text.toUpperCase();
        let letters = [];
        for (let i = 0; i < text.length; i++) {
            letters.push(this.addLetter(x + i * 5, y, text[i]));
        }

        return letters;
    },
};
