import dungeonBg from '../assets/dungeon3x2.png';
import selectAction from '../assets/actions.png';
import selectActionReap from '../assets/actions_reap.png';
import partymember from '../assets/party1_alive.png';
import partymember_hurt from '../assets/party1_hurt.png';
import partymember_dead from '../assets/party_dead.png';
import death from '../assets/death.png';
import death1 from '../assets/death_1.png';
import death2 from '../assets/death_2.png';
import death3 from '../assets/death_3.png';
import death4 from '../assets/death_4.png';
import health from '../assets/health.png';
import bird from '../assets/monster.png';
import blob from '../assets/monster2.png';
import ghost from '../assets/monster3.png';
import skull from '../assets/monster4.png';
import heart from '../assets/heart.png';
import overlay from '../assets/overlay.png';
import sword from '../assets/sword.png';
import scythe from '../assets/scythe.png';
import Phaser from 'phaser';
import fontUrl from '../assets/fonts/Gizmo199darkfont.png';
import font from '../font';
import Player from '../entities/Player';
import PartyMember from '../entities/PartyMember';
import Blob from '../entities/enemies/Blob';
import Skull from '../entities/enemies/Skull';
import Bird from '../entities/enemies/Bird';
import Ghost from '../entities/enemies/Ghost';
import LevelData from '../LevelData';

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

const MOVE = 1;
const ATTACK = 1 << 1;
const REAP = 1 << 2;

export default class Dungeon extends Phaser.Scene {
    constructor() {
        super({ key: 'dungeon', active: false });
    }
    _select_phase = '';
    _turn = 'player';
    _keys = {};
    keys = [];
    letters = [];
    /**
     * @type {LevelData}
     */
    levelData = null;
    bg = null;
    overlay = null;
    gameOver = false;
    loading = false;

    /**
     * @type {BaseEntity}
     */
    selectedPlayer = null;
    selectedAction = null;
    actionsBitMask = 0;
    reward = 0;
    static SELECT_PHASE_PLAYER = 'player';
    static SELECT_PHASE_PLAYER_ACTION = 'player_action';
    static SELECT_PHASE_PLAYER_TARGET = 'player_target';
    static SELECT_PHASE_ENEMY = 'enemy';
    static SELECT_PHASE_ENEMY_ACTION = 'enemy_action';
    static SELECT_PHASE_ENEMY_TARGET = 'enemy_move';

    get turn() {
        return this._turn;
    }

    set turn(turn) {
        console.log('turn going to ', turn);
        this._turn = turn;
        const { players, enemies } = this.levelData;
        players.concat(enemies).forEach(p => (p.acted = false));
        if (turn === 'enemy') {
            this.select_phase = null;
        } else {
            this.select_phase = SELECT_PHASE_PLAYER;
        }
    }

    get select_phase() {
        return this._select_phase;
    }

    set select_phase(newVal) {
        if (newVal === this._select_phase) {
            return;
        }
        this._select_phase = newVal;
        this.overlay && this.overlay.destroy();
        this.overlay = null;

        switch (this._select_phase) {
            case SELECT_PHASE_PLAYER:
                this.levelData.makeOccupiedPlayerCellsSelectable(c => {
                    let p = this.levelData.getPlayerByPosition(
                        c.gridPosition.x,
                        c.gridPosition.y
                    );
                    return p && !p.acted;
                });
                break;
            case SELECT_PHASE_PLAYER_ACTION:
                let enemyCells = this.levelData.getOccupiedEnemyCells();
                let inRange = enemyCells.filter(c => {
                    return (
                        c.gridPosition.y === 1 ||
                        this.selectedPlayer.gridPosition.y === 0
                    );
                });

                this.actionsBitMask = 0;

                // Bitmask of 3 bits. XYZ where 2 is move, Y is attack, and X is reap.
                this.actionsBitMask |= this.levelData.getEmptyPlayerCells()
                    .length
                    ? MOVE
                    : 0;
                this.actionsBitMask |=
                    enemyCells.length &&
                    inRange.length &&
                    inRange.filter(c =>
                        this.levelData.getEnemyByPosition(
                            c.gridPosition.x,
                            c.gridPosition.y
                        )
                    ).length
                        ? ATTACK
                        : 0;
                this.actionsBitMask |=
                    this.selectedPlayer instanceof Player &&
                    this.levelData.players.filter(
                        p =>
                            p instanceof PartyMember &&
                            p.health <= this.selectedPlayer.power + 1 &&
                            p.alive
                    ).length
                        ? REAP
                        : 0;

                this.overlay = this.add.image(0, 0, 'overlay');
                this.overlay.setOrigin(0, 0);
                this.overlay.setDepth(100000);

                if (this.actionsBitMask & MOVE) {
                    this.letters = this.letters.concat(
                        font.drawText(20, 12, '1. move')
                    );
                }
                if (this.actionsBitMask & ATTACK) {
                    this.letters = this.letters.concat(
                        font.drawText(20, 22, '2. attack')
                    );
                }
                if (this.actionsBitMask & REAP) {
                    this.letters = this.letters.concat(
                        font.drawText(20, 32, '3. reap')
                    );
                }
                this.letters.forEach((l, i) =>
                    l.setDepth(this.overlay.depth + i)
                );
                break;
            case SELECT_PHASE_PLAYER_TARGET:
                font.removeText(this.letters);
                if (this.selectedAction === MOVE) {
                    this.levelData.makeEmptyPlayerCellsSelectable();
                } else if (this.selectedAction === ATTACK) {
                    let inRange = this.levelData
                        .getOccupiedEnemyCells()
                        .filter(c => {
                            let e = this.levelData.getEnemyByPosition(
                                c.gridPosition.x,
                                c.gridPosition.y
                            );
                            return (
                                e &&
                                (this.selectedPlayer.gridPosition.y === 0 ||
                                    c.gridPosition.y === 1)
                            );
                        });
                    this.levelData.makeCellsSelectable(inRange);
                } else if (this.selectedAction === REAP) {
                    this.levelData.makeOccupiedPlayerCellsSelectable(c => {
                        let p = this.levelData.getPlayerByPosition(
                            c.gridPosition.x,
                            c.gridPosition.y
                        );
                        return (
                            p instanceof PartyMember &&
                            p.alive &&
                            p.health <= this.selectedPlayer.power + 1
                        );
                    });
                }
                break;
        }
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

    initLevel() {
        font.init(this);
        let gold = this.registry.get('gold');
        this.bg = this.add.image(0, 0, 'dungeon');
        this.levelData = new LevelData(
            this,
            [new Player(this, 1, 1)],
            [
                //    new Skull(this, 2, 1),
                new Blob(this, 1, 0),
                //new Blob(this, 2, 0),
                //new Blob(this, 2, 1),
            ]
        );
        if (gold >= 200 && gold < 1000) {
            this.levelData.enemies.push(new Bird(this, 0, 1))
        }
        if (gold >= 500 && gold < 2000) {
            this.levelData.enemies.push(new Blob(this, 2, 1));
        }
        if (gold >= 1000) {
            this.levelData.enemies.push(new Ghost(this, 2, 0));
        }
        if (gold >= 2000) {
            this.levelData.enemies.push(new Skull(this, 0, 0))
        }
        for (let i = 0; i < this.registry.get('members'); i++) {
            let x, y;
            if (i === 0) {
                x = 0;
                y = 0;
            }
            if (i === 1) {
                x = 1;
                y = 0;
            }
            if (i === 2) {
                x = 2;
                y = 0;
            }
            if (i === 3) {
                x = 0;
                y = 1;
            }
            if (i === 4) {
                x = 2;
                y = 1;
            }
            this.levelData.players.push(
              new PartyMember(this, x, y)
            )
        }

        this.levelData.enemies.forEach(e => {
            this.reward += e.reward;
        });
        this.select_phase = SELECT_PHASE_PLAYER;
    }

    create() {
        this._select_phase = '';
        this._turn = 'player';
        this._keys = {};
        this.keys = [];
        this.letters = [];
        this.levelData = null;
        this.bg = null;
        this.overlay = null;
        this.gameOver = false;
        this.loading = false;
        this.selectedPlayer = null;
        this.selectedAction = null;
        this.actionsBitMask = 0;
        this.reward = 0;
        console.log('start');
        //this.levelData.enemies[0].hurt(3);
        font.init(this);
        this.initLevel();
        this.bg.setOrigin(0, 0);
        this._keys = this.input.keyboard.addKeys(
            'ONE,NUMPAD_ONE,TWO,NUMPAD_TWO,THREE,NUMPAD_THREE,FOUR,NUMPAD_FOUR,FIVE,NUMPAD_FIVE,SIX,NUMPAD_SIX,SEVEN,NUMPAD_SEVEN,EIGHT,NUMPAD_EIGHT,NINE,NUMPAD_NINE,ZERO,NUMPAD_ZERO',
            true,
            false
        );
    }

    update(time, delta) {
        if (this.gameOver) {
            let overlay = this.add.image(0, 0, 'overlay');
            overlay.setOrigin(0, 0);
            overlay.setDepth(100000);
            let letters = font.drawText(18, 12, 'Game Over!');
            letters = letters.concat(font.drawText(8, 24, 'Death... died?'));
            letters = letters.concat(font.drawText(8, 36, 'PLease refresh.'));
            letters.forEach((l, i) => l.setDepth(overlay.depth + i));
        }
        if (this.loading) {
            return;
        }
        let monstersAlive = !!this.levelData.enemies.find(e => e.alive);
        if (!monstersAlive) {
            let partyMembersAlive = this.levelData.players.filter(p => p.alive)
                .length;
            this.registry.set('reward', this.reward);
            this.registry.set('alive', partyMembersAlive);

            this.loading = true;
            this.scene.transition({
                target: 'clear',
                duration: 500,
                moveBelow: true,
                onUpdate: this.transitionOut,
            });
        }
        this.updateInput();
        switch (this.turn) {
            case 'player':
                this.updatePlayerTurn();
                break;
            case 'enemy':
                this.updateEnemyTurn();
                break;
        }
    }

    transitionOut(progress) {
        this.cameras.main.x = -84 * progress;
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
        switch (this.select_phase) {
            case SELECT_PHASE_PLAYER:
                this.updatePlayerSelect();
                break;
            case SELECT_PHASE_PLAYER_ACTION:
                this.updateActionSelect();
                break;
            case SELECT_PHASE_PLAYER_TARGET:
                this.updateTargetSelect();
        }
    }

    updateEnemyTurn() {
        if (window.tweening) {
            return;
        }
        const { players, enemies } = this.levelData;
        let enemy = enemies.find(e => !e.acted);
        if (!enemy) {
            this.turn = 'player';
            return;
        }
        let partymember = players.find(
            p =>
                p instanceof PartyMember &&
                p.alive &&
                (p.gridPosition.y === 0 || enemy.gridPosition.y === 1)
        );
        if (!partymember) {
            partymember = players.find(
                p =>
                    p instanceof Player &&
                    p.alive &&
                    (p.gridPosition.y === 0 || enemy.gridPosition.y === 1)
            );
        }
        if (partymember) {
            enemy.attack(partymember);
            enemy.acted = true;
        } else {
            let openEnemyCells = this.levelData.getEmptyEnemyCells();
            let cell = openEnemyCells.find(c => c.gridPosition.y === 1);

            if (cell) {
                enemy.moveTo(cell.gridPosition.x, cell.gridPosition.y);
            }
            enemy.acted = true;
        }
    }

    updatePlayerSelect() {
        let index = this.keys.findIndex(isDown => isDown);
        let cell = this.levelData.getPlayerCellByIndex(index, true);
        if (index < 0 || !cell) {
            return;
        }

        let player = this.levelData.getPlayerByIndex(index);
        if (!player) {
            return;
        }
        player.selected = true;
        this.selectedPlayer = player;
        this.select_phase = SELECT_PHASE_PLAYER_ACTION;
    }

    updateActionSelect() {
        let index = this.keys.findIndex(isDown => isDown);
        if (index < 0) {
            return;
        }

        if (this.actionsBitMask & MOVE && index === 1) {
            this.selectedAction = MOVE;
            this.select_phase = SELECT_PHASE_PLAYER_TARGET;
        }

        if (this.actionsBitMask & ATTACK && index === 2) {
            this.selectedAction = ATTACK;
            this.select_phase = SELECT_PHASE_PLAYER_TARGET;
        }

        if (
            this.actionsBitMask & REAP &&
            index === 3 &&
            this.selectedPlayer instanceof Player
        ) {
            this.selectedAction = REAP;
            this.select_phase = SELECT_PHASE_PLAYER_TARGET;
        }
    }

    updateTargetSelect() {
        let index = this.keys.findIndex(isDown => isDown);
        if (index < 0) {
            return;
        }

        let target;
        let cell;

        switch (this.selectedAction) {
            case MOVE:
                cell = this.levelData.getPlayerCellByIndex(index, true);
                if (
                    !cell ||
                    !(target = this.levelData.getPlayerCellByIndex(index))
                ) {
                    return;
                }
                this.selectedPlayer.moveTo(
                    target.gridPosition.x,
                    target.gridPosition.y
                );
                break;
            case ATTACK:
                cell = this.levelData.getEnemyCellByIndex(index, true);
                if (
                    !cell ||
                    !(target = this.levelData.getEnemyByIndex(index))
                ) {
                    return;
                }
                this.selectedPlayer.attack(target);
                break;
            case REAP:
                cell = this.levelData.getPlayerCellByIndex(index, true);
                if (
                    !cell ||
                    !(target = this.levelData.getPlayerByIndex(index))
                ) {
                    return;
                }
                this.selectedPlayer.reap(target);
                break;
        }

        this.selectedPlayer.acted = true;
        this.selectedPlayer = null;
        if (this.levelData.players.find(p => !p.acted)) {
            this.select_phase = SELECT_PHASE_PLAYER;
        } else {
            this.turn = 'enemy';
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
