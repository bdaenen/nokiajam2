import dungeonBg from '../assets/dungeon3x2.png';
import selectAction from '../assets/actions.png';
import selectActionReap from '../assets/actions_reap.png';
import partymember from '../assets/party1_alive.png';
import partymember_hurt from '../assets/party1_hurt.png';
import partymember_dead from '../assets/party_dead.png';
import death from '../assets/death.png';
import death1 from '../assets/death_1.png';
import death2 from '../assets/death_2.png';
import bird from '../assets/monster.png';
import blob from '../assets/monster2.png';
import ghost from '../assets/monster3.png';
import skull from '../assets/monster4.png';
import heart from '../assets/heart.png';
import selected from '../assets/selected.png';
import Phaser from 'phaser';
import EnemyEntity from '../entities/Enemy';
import fontUrl from '../assets/fonts/Gizmo199darkfont.png';
import font from '../font.js';
import Player from '../entities/Player';
import PartyMember from "../entities/PartyMember";
import Blob from "../entities/enemies/Blob";

const keynameMap = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    ZERO: 0,
};

export default class Dungeon extends Phaser.Scene {
    _select_phase = '';
    _turn = 'player';
    _select_text = [];
    _keys = {};
    levelData = null;
    bg = null;
    overlay = null;
    selectedPlayer = null;

    get select_phase() {
        return this._select_phase;
    }
    set select_phase(newVal) {
        if (newVal !== this._select_phase) {
            this._select_phase = newVal;
            this._select_text.forEach(sprite => {
                sprite.destroy();
            });

            switch (this._select_phase) {
                case 'player':
                    this.overlay && this.overlay.destroy();
                    this.overlay = null;

                    this._select_text = this._select_text.concat(
                        font.drawText(25, 31, '1')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(53, 31, '2')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(80, 31, '3')
                    );

                    this._select_text = this._select_text.concat(
                        font.drawText(25, 44, '4')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(53, 44, '5')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(80, 44, '6')
                    );
                    break;
                case 'enemy':
                    this.overlay && this.overlay.destroy();
                    this.overlay = null;

                    this._select_text = this._select_text.concat(
                        font.drawText(25, 7, '1')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(53, 7, '2')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(80, 7, '3')
                    );

                    this._select_text = this._select_text.concat(
                        font.drawText(25, 19, '4')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(53, 19, '5')
                    );
                    this._select_text = this._select_text.concat(
                        font.drawText(80, 19, '6')
                    );
                    break;
                case 'action':
                    const overlayKey =
                        this.levelData.enemies
                            .filter(e => !e.alive)
                            .concat(this.levelData.player.filter(p => !p.alive))
                            .length && this.selectedPlayer instanceof Player
                            ? 'selectActionReap'
                            : 'selectAction';
                    this.overlay = this.add.image(0, 0, overlayKey);
                    this.overlay.setOrigin(0, 0);
                    this.overlay.setDepth(Infinity);
                    break;
            }
        }
    }

    get keys() {
        let keys = [];
        Object.entries(this._keys).forEach(key => {
            const keyname = keynameMap[key[0].replace('NUMPAD_', '')];
            if (keys[keyname] !== undefined && keys[keyname] === true) {
                return;
            }

            keys[keyname] = key[1].isDown;
        });

        return keys;
    }

    preload() {
        this.load.image('heart', heart);
        this.load.image('dungeon', dungeonBg);
        this.load.image('selectAction', selectAction);
        this.load.image('selectActionReap', selectActionReap);
        this.load.image('death', death);
        this.load.image('death1', death1);
        this.load.image('death2', death2);
        this.load.image('bird', bird);
        this.load.image('blob', blob);
        this.load.image('ghost', ghost);
        this.load.image('skull', skull);
        this.load.image('partymember', partymember);
        this.load.image('partymember_hurt', partymember_hurt);
        this.load.image('rip', partymember_dead);
        this.load.image('selected', selected);
        this.load.spritesheet('nokia', fontUrl, {
            frameWidth: 5,
            frameHeight: 5,
        });
    }

    initLevel() {
        font.init(this);
        this.select_phase = 'player';
        return {
            player: [new Player(this, 1, 0), new PartyMember(this, 0, 0)],
            enemies: [
                new Blob(this, 0, 0),
                new Blob(this, 0, 1),
                new Blob(this, 1, 0),
                new Blob(this, 1, 1),
                new Blob(this, 2, 0),
                new Blob(this, 2, 1),
            ],
        };
    }

    create() {
        this.bg = this.add.image(0, 0, 'dungeon');
        this.levelData = this.initLevel();
        //this.levelData.enemies[0].hurt(3);
        font.init(this);
        this.bg.setOrigin(0, 0);
        this._keys = this.input.keyboard.addKeys(
            'ONE,NUMPAD_ONE,TWO,NUMPAD_TWO,THREE,NUMPAD_THREE,FOUR,NUMPAD_FOUR,FIVE,NUMPAD_FIVE,SIX,NUMPAD_SIX,SEVEN,NUMPAD_SEVEN,EIGHT,NUMPAD_EIGHT,NINE,NUMPAD_NINE,ZERO,NUMPAD_ZERO',
            true
        );
    }

    update(time, delta) {
        switch (this._turn) {
            case 'player':
                this.updatePlayerTurn();
                break;
            case 'enemy':
                this.updateEnemyTurn();
                break;
            case 'action':
                this.updateActionSelect();
                break;
        }
    }

    updatePlayerTurn() {
        let index = this.keys.findIndex(isDown => isDown);
        if (index < 0) {
            return;
        }

        let player = this.levelData.player.find(p => {
            return p.gridPosition.x + p.gridPosition.y * 3 + 1 === index;
        });

        if (player) {
            player.selected = true;
            this.selectedPlayer = player;
            this.select_phase = 'action';
        }
    }

    updateActionSelect() {
        let index = this.keys.findIndex(isDown => isDown);
        if (index < 0) {
            return;
        }

        if (index === 1) {
            this._select_phase = 'player_move';
        }

        if (index === 2) {
            this.select_phase = 'enemy';
        }

        if (this.overlay.texture.key.toLowerCase.includes('reap')) {
            if (index === 3) {
                //const overlayKey = this.levelData.enemies.filter((e) => !e.alive).concat(true ? 'selectActionReap' : 'selectAction');

                if (this.levelData.player.some(p => !p.alive)) {
                }
            }
        }
    }
}
