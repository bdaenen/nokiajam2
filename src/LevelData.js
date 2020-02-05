import PlayerCellSelector from './entities/PlayerCellSelector';
import EnemyCellSelector from './entities/EnemyCellSelector';
import Base from './entities/Base';

export default class LevelData {
    constructor(scene, players, enemies) {
        /**
         * @type Base[]
         */
        this.players = players;
        /**
         * @type Base[]
         */
        this.enemies = enemies;
        /**
         * @type PlayerCellSelector[]
         */
        this.player_cells = [
            new PlayerCellSelector(scene, 0, 0),
            new PlayerCellSelector(scene, 0, 1),
            new PlayerCellSelector(scene, 1, 0),
            new PlayerCellSelector(scene, 1, 1),
            new PlayerCellSelector(scene, 2, 0),
            new PlayerCellSelector(scene, 2, 1),
        ];
        /**
         * @type EnemyCellSelector[]
         */
        this.enemy_cells = [
            new EnemyCellSelector(scene, 0, 0),
            new EnemyCellSelector(scene, 0, 1),
            new EnemyCellSelector(scene, 1, 0),
            new EnemyCellSelector(scene, 1, 1),
            new EnemyCellSelector(scene, 2, 0),
            new EnemyCellSelector(scene, 2, 1),
        ];

        this.allCells = this.player_cells.concat(this.enemy_cells);
    }

    makeCellsSelectable(cells, filter) {
        this.allCells.forEach(c => {
            c.isSelectable = false;
        });
        if (filter instanceof Function) {
            cells = cells.filter(filter);
        }
        cells.forEach(c => {
            c.isSelectable = true;
        });
    }

    makePlayerCellsSelectable(filter) {
        this.makeCellsSelectable(this.player_cells, filter);
    }

    makeEnemyCellsSelectable(filter) {
        this.makeCellsSelectable(this.enemy_cells, filter);
    }

    makeEmptyPlayerCellsSelectable(filter) {
        this.makeCellsSelectable(this.getEmptyPlayerCells(), filter);
    }

    makeOccupiedPlayerCellsSelectable(filter) {
        this.makeCellsSelectable(this.getOccupiedPlayerCells(), filter);
    }

    makeEmptyEnemyCellsSelectable(filter) {
        this.makeCellsSelectable(this.getEmptyEnemyCells(), filter);
    }

    makeOccupiedEnemyCellsSelectable(filter) {
        this.makeCellsSelectable(this.getOccupiedEnemyCells(), filter);
    }

    getEmptyPlayerCells() {
        return this.player_cells.filter(c => {
            return !this.players.find(p => {
                return (
                    p.gridPosition.x === c.gridPosition.x &&
                    p.gridPosition.y === c.gridPosition.y
                );
            });
        });
    }

    getEmptyEnemyCells() {
        return this.enemy_cells.filter(c => {
            return !this.enemies.find(p => {
                return (
                    p.gridPosition.x === c.gridPosition.x &&
                    p.gridPosition.y === c.gridPosition.y
                );
            });
        });
    }

    getOccupiedEnemyCells() {
        return this.enemy_cells.filter(c => {
            return !!this.enemies.find(p => {
                return (
                    p.gridPosition.x === c.gridPosition.x &&
                    p.gridPosition.y === c.gridPosition.y
                );
            });
        });
    }

    getOccupiedPlayerCells() {
        return this.player_cells.filter(c => {
            return !!this.players.find(p => {
                return (
                    p.gridPosition.x === c.gridPosition.x &&
                    p.gridPosition.y === c.gridPosition.y
                );
            });
        });
    }

    getPlayerByIndex(index) {
        return this.players.find(p => {
            return p.alive && p.gridPosition.x + p.gridPosition.y * 3 + 1 === index;
        });
    }

    getPlayerByPosition(x, y) {
        return this.players.find(p => {
            return p.alive && p.gridPosition.x === x && p.gridPosition.y === y;
        });
    }

    getEnemyByIndex(index) {
        return this.enemies.find(p => {
            return (
                p.alive && p.gridPosition.x + p.gridPosition.y * 3 + 1 === index
            );
        });
    }

    getEnemyByPosition(x, y) {
        return this.enemies.find(p => {
            return p.alive && p.gridPosition.x === x && p.gridPosition.y === y;
        });
    }

    getPlayerCellByIndex(index, onlySelectable = true) {
        let cells = this.player_cells;
        if (onlySelectable) {
            cells = cells.filter(c => {
                return c.isSelectable;
            });
        }

        return cells.find(c => {
            return c.gridPosition.x + c.gridPosition.y * 3 + 1 === index;
        });
    }

    getEnemyCellByIndex(index, onlySelectable = true) {
        let cells = this.enemy_cells;
        if (onlySelectable) {
            cells = cells.filter(c => {
                return c.isSelectable;
            });
        }

        return cells.find(c => {
            return c.gridPosition.x + c.gridPosition.y * 3 + 1 === index;
        });
    }
}
