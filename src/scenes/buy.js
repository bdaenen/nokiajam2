import Phaser from 'phaser';
import font from '../font';
import bg from '../assets/bg.png';
import splash from '../assets/intro.png';
import fontUrl from '../assets/fonts/Gizmo199darkfont.png';
import heart from '../assets/heart.png';
import dungeonBg from '../assets/dungeon3x2.png';
import selectAction from '../assets/actions.png';
import overlay from '../assets/overlay.png';
import selectActionReap from '../assets/actions_reap.png';
import death from '../assets/death.png';
import health from '../assets/health.png';
import death1 from '../assets/death_1.png';
import death2 from '../assets/death_2.png';
import death3 from '../assets/death_3.png';
import death4 from '../assets/death_4.png';
import bird from '../assets/monster.png';
import blob from '../assets/monster2.png';
import ghost from '../assets/monster3.png';
import skull from '../assets/monster4.png';
import partymember from '../assets/party1_alive.png';
import partymember_hurt from '../assets/party1_hurt.png';
import partymember_dead from '../assets/party_dead.png';
import sword from '../assets/sword.png';
import scythe from '../assets/scythe.png';

export default class Buy extends Phaser.Scene {
    constructor() {
        super({ key: 'buy', active: false });
    }
    preload() {
        this.load.image('heart', heart);
        this.load.image('dungeon', dungeonBg);
        this.load.image('selectAction', selectAction);
        this.load.image('selectActionReap', selectActionReap);
        this.load.image('death', death);
        this.load.image('health', health);
        this.load.image('death1', death1);
        this.load.image('death2', death2);
        this.load.image('death3', death3);
        this.load.image('death4', death4);
        this.load.image('bird', bird);
        this.load.image('blob', blob);
        this.load.image('ghost', ghost);
        this.load.image('skull', skull);
        this.load.image('partymember', partymember);
        this.load.image('partymember_hurt', partymember_hurt);
        this.load.image('rip', partymember_dead);
        this.load.image('overlay', overlay);
        this.load.image('sword', sword);
        this.load.image('scythe', scythe);
        this.load.spritesheet('nokia', fontUrl, {
            frameWidth: 5,
            frameHeight: 5,
        });
    }
    create() {
        font.init(this);
        this.letters = [];
        this.members = 0;
        this.gold = this.registry.get('gold');
        let overlay = this.add.image(0, 0, 'overlay');
        overlay.setOrigin(0, 0);

        this.input.keyboard.on('keydown', e => {
            if (e.key === '2') {
                if (this.members < 4 && this.gold >= 50) {
                    this.members++;
                    this.gold -= 50;
                    this.createLetters();
                }
            }

            if (e.key === '5') {
                this.registry.set('gold', this.gold);
                this.registry.set('members', this.members);
                this.scene.transition({
                    target: 'dungeon',
                    duration: 500,
                    moveBelow: true,
                    onUpdate: this.transitionOut,
                });
            }
        });
        this.createLetters()
    }

    createLetters() {
        font.removeText(this.letters);
        this.letters = font.drawText(6, 6, `Pty Members:${this.members}/4`);

        this.letters = this.letters.concat(font.drawText(6, 30, `2 to buy (50)`));
        this.letters = this.letters.concat(
            font.drawText(6, 14, `Gold: ${this.gold}`)
        );
        this.letters = this.letters.concat(font.drawText(6, 38, `5 to continue`));
    }
    update() {}

    transitionOut(progress) {
        this.cameras.main.x = -84 * progress;
        if (progress >= 1) {
            this.scene.start('dungeon')
        }
    }
}
