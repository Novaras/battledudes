"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Affinity {
    get name() {
        return this._name;
    }
    get weaknesses() {
        return this._weaknesses;
    }
    get resistances() {
        return this._resistances;
    }
    constructor({ name, weaknesses, resistances }) {
        this._name = name;
        this._weaknesses = weaknesses;
        this._resistances = resistances;
    }
}
exports.Affinity = Affinity;
//# sourceMappingURL=affinity.js.map