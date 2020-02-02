"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const affinity_1 = require("./affinity");
const attack_1 = require("./attack");
const AffinityData = __importStar(require("./datasource/affinity.json"));
const AttackData = __importStar(require("./datasource/attack.json"));
class Goon {
    //#endregion
    //#region getters
    get name() {
        return this._name;
    }
    get HP() {
        return this._HP;
    }
    get max_HP() {
        return this._max_HP;
    }
    get attack() {
        return this._attack;
    }
    get defence() {
        return this._defence;
    }
    get speed() {
        return this._speed;
    }
    get affinities() {
        return this._affinities;
    }
    get attacks() {
        return this._attacks;
    }
    //#endregion
    constructor({ name, HP, attack, defence, speed, affinities, attacks }) {
        this._name = name;
        this._max_HP = HP;
        this._HP = HP;
        this._attack = attack;
        this._defence = defence;
        this._speed = speed;
        this._affinities = affinities
            .map(aff_name => new affinity_1.Affinity(AffinityData.data.find(aff_data => aff_data.name.toLowerCase() === aff_name.toLowerCase())));
        this._attacks = attacks
            .map(atk_name => new attack_1.Attack(AttackData.data.find(atk_data => atk_data.name.toLowerCase() === atk_name.toLowerCase())));
    }
    takeDamage(amount) {
        this._HP = Math.max(0, this.HP - amount);
    }
}
exports.Goon = Goon;
//# sourceMappingURL=goon.js.map