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
const AffinityData = __importStar(require("./datasource/affinity.json"));
class Attack {
    get name() {
        return this._name;
    }
    get power() {
        return this._power;
    }
    get accuracy() {
        return this._accuracy;
    }
    get priority() {
        return this._priority;
    }
    get affinities() {
        return this._affinities;
    }
    constructor({ name, power, accuracy, priority, affinities }) {
        this._name = name;
        this._power = power;
        this._accuracy = accuracy;
        this._priority = priority;
        this._affinities = affinities
            .map(aff_name => new affinity_1.Affinity(AffinityData.data.find(aff_data => aff_data.name === aff_name)));
    }
}
exports.Attack = Attack;
//# sourceMappingURL=attack.js.map