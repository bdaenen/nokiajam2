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
import PartyMember from '../entities/PartyMember';
import Blob from '../entities/enemies/Blob';
import Skull from '../entities/enemies/Skull';
import PlayerCellSelector from '../entities/PlayerCellSelector';
import EnemyCellSelector from '../entities/EnemyCellSelector';

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
    keys = [];
    levelData = null;
    bg = null;
    overlay = null;
    selectedPlayer = null;
    selectedAction = null;
    static SELECT_PHASE_PLAYER = 'player';
    static SELECT_PHASE_PLAYER_ACTION = 'player_action';
    static SELECT_PHASE_PLAYER_TARGET = 'player_target';
    static SELECT_PHASE_ENEMY = 'enemy';
    static SELECT_PHASE_ENEMY_ACTION = 'enemy_action';
    static SELECT_PHASE_ENEMY_TARGET = 'enemy_move';

    get select_phase() {
        return this._select_phase;
    }
    set select_phase(newVal) {
        if (newVal === this._select_phase) {
            return;
        }
        this._select_phase = newVal;
        this._select_text.forEach(sprite => {
            sprite.destroy();
        });
        this.overlay && this.overlay.destroy();
        this.overlay = null;

        this.levelData.enemies
            .concat(this.levelData.player)
            .forEach(e => e.clearCornerNumber());
        switch (this._select_phase) {
            case SELECT_PHASE_PLAYER:
                this.levelData.player.forEach(p => p.drawCornerNumber());
                break;
            case SELECT_PHASE_PLAYER_TARGET:
                if (this.selectedAction === 'move') {
                    this.levelData.player_cells.filter(pc => {
                        return !this.levelData.player.some(
                            p =>
                                p.gridPosition.x === pc.gridPosition.x &&
                                p.gridPosition.y === pc.gridPosition.y
                        );
                    }).forEach((pc) => (pc.drawCornerNumber()));
                }
                else if (this.selectedAction === 'attack') {
                    this.levelData.enemies.forEach((enemy) => {
                        if (this.selectedPlayer.gridPosition.y === 0 || enemy.gridPosition.y === 1) {
                            enemy.drawCornerNumber()
                        }
                    })
                }
                else if (this.selectedAction === 'reap') {
                    this.levelData.player.filter((p) => p.health === 1 && p !== this.selectedPlayer).forEach((p) => p.drawCornerNumber())
                }
                break;
            case SELECT_PHASE_ENEMY:
                this.levelData.enemies.forEach(e => e.drawCornerNumber());
                this.overlay && this.overlay.destroy();
                this.overlay = null;
                break;
            case SELECT_PHASE_PLAYER_ACTION:
                const overlayKey =
                    this.levelData.player.filter(p => p.health === 1).length &&
                    this.selectedPlayer instanceof Player
                        ? 'selectActionReap'
                        : 'selectAction';
                this.overlay = this.add.image(0, 0, overlayKey);
                this.overlay.setOrigin(0, 0);
                this.overlay.setDepth(Infinity);
                break;
        }
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
        this.bg = this.add.image(0, 0, 'dungeon');
        this.levelData = {
            player: [new Player(this, 1, 1), new PartyMember(this, 0, 0)],
            enemies: [
                //new Blob(this, 0, 0),
                //new Blob(this, 0, 1),
                new Skull(this, 2, 0),
                new Blob(this, 1, 0),
                //new Blob(this, 2, 0),
                //new Blob(this, 2, 1),
            ],
            player_cells: [
                new PlayerCellSelector(this, 0, 0),
                new PlayerCellSelector(this, 0, 1),
                new PlayerCellSelector(this, 1, 0),
                new PlayerCellSelector(this, 1, 1),
                new PlayerCellSelector(this, 2, 0),
                new PlayerCellSelector(this, 2, 1),
            ],
            enemy_cells: [
                new EnemyCellSelector(this, 0, 0),
                new EnemyCellSelector(this, 0, 1),
                new EnemyCellSelector(this, 1, 0),
                new EnemyCellSelector(this, 1, 1),
                new EnemyCellSelector(this, 2, 0),
                new EnemyCellSelector(this, 2, 1),
            ],
        };
        this.select_phase = SELECT_PHASE_PLAYER;
    }

    create() {
        //this.levelData.enemies[0].hurt(3);
        font.init(this);
        this.initLevel();
        this.bg.setOrigin(0, 0);
        this._keys = this.input.keyboard.addKeys(
            'ONE,NUMPAD_ONE,TWO,NUMPAD_TWO,THREE,NUMPAD_THREE,FOUR,NUMPAD_FOUR,FIVE,NUMPAD_FIVE,SIX,NUMPAD_SIX,SEVEN,NUMPAD_SEVEN,EIGHT,NUMPAD_EIGHT,NINE,NUMPAD_NINE,ZERO,NUMPAD_ZERO',
            true,
            false
        );
        console.log(this._keys);
    }

    update(time, delta) {
        this.updateInput();
        switch (this._turn) {
            case 'player':
                this.updatePlayerTurn();
                break;
            case 'enemy':
                this.updateEnemyTurn();
                break;
        }
    }

    updateInput() {
        this.keys = [];
        Object.entries(this._keys).forEach(([name, key]) => {
            if (Phaser.Input.Keyboard.JustDown(key)) {
                this.keys[keynameMap[name.replace('NUMPAD_', '')]] = true;
            }
        });
    }

    updatePlayerTurn() {
        let index = this.keys.findIndex(isDown => isDown);
        if (index < 0) {
            return;
        }

        switch (this.select_phase) {
            case SELECT_PHASE_PLAYER:
                let player = this.levelData.player.find(p => {
                    return (
                        p.gridPosition.x + p.gridPosition.y * 3 + 1 === index
                    );
                });
                player.selected = true;
                this.selectedPlayer = player;
                this.select_phase = SELECT_PHASE_PLAYER_ACTION;
                break;
            case SELECT_PHASE_PLAYER_ACTION:
                this.updateActionSelect();
                break;
            case SELECT_PHASE_PLAYER_TARGET:
                this.updateTargetSelect();
        }
    }

    updateActionSelect() {
        let index = this.keys.findIndex(isDown => isDown);
        if (index < 0) {
            return;
        }

        // TODO: don't allow move if not possible! Needs new sprite!
        if (index === 1) {
            this.selectedAction = 'move';
            this.select_phase = SELECT_PHASE_PLAYER_TARGET;
        }

        // TODO: don't allow attack if not possible! Needs new sprite!
        if (index === 2) {
            this.selectedAction = 'attack';
            this.select_phase = SELECT_PHASE_PLAYER_TARGET;
        }

        console.log(this.overlay.texture);
        if (
            index === 3 &&
            this.selectedPlayer instanceof Player &&
            this.overlay.texture.key.toLowerCase().includes('reap')
        ) {
            this.selectedAction = 'reap';
            this.select_phase = SELECT_PHASE_PLAYER_TARGET;
        }
    }

    updateTargetSelect() {
        let index = this.keys.findIndex(isDown => isDown);
        if (index < 0) {
            return;
        }

        let target;

        switch (this.selectedAction) {
            case 'move':
                target = this.levelData.player_cells.find(p => {
                    return (
                        p.gridPosition.x + p.gridPosition.y * 3 + 1 === index
                    );
                });
                this.selectedPlayer.gridPosition.x = target.gridPosition.x;
                this.selectedPlayer.gridPosition.y = target.gridPosition.y;
            break;
            case 'attack':
                target = this.levelData.enemies.find(e => {
                    return (
                        e.gridPosition.x + e.gridPosition.y * 3 + 1 === index
                    );
                });
                target.hurt(this.selectedPlayer.str);
            break;
            case 'reap':
                target = this.levelData.player.find(p => {
                    return p.gridPosition.x + p.gridPosition.y * 3 + 1 === index
                });
                this.selectedPlayer.reap(target);
        }
    }
}

const {
    SELECT_PHASE_PLAYER,
    SELECT_PHASE_PLAYER_ACTION,
    SELECT_PHASE_PLAYER_TARGET,
    SELECT_PHASE_ENEMY,
    SELECT_PHASE_ENEMY_ACTION,
    SELECT_PHASE_ENEMY_TARGET,
} = Dungeon;
