"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    get name() {
        return this._name;
    }
    get team() {
        return this._team;
    }
    get is_AI() {
        return this._is_AI;
    }
    constructor(name, team, is_AI = false) {
        this._name = name;
        this._team = team;
        this._is_AI = is_AI;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map