"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const battle_1 = require("./battle");
//#region Types
const goon_1 = require("./goon");
//#endregion
//#region Data sources
const GoonDataSource = __importStar(require("./datasource/goon.json"));
//#endregion
const player_1 = require("./player");
const team_1 = require("./team");
const byName = (v, n) => v.name.toLowerCase() === n.toLowerCase();
const my_goon = new goon_1.Goon(GoonDataSource.data.find(v => byName(v, `Flame Fella`)));
const another_goon = new goon_1.Goon(GoonDataSource.data.find(v => byName(v, `Nikola Tesla`)));
(async () => {
    try {
        const player = new player_1.Player(`Tom`, new team_1.Team([my_goon, another_goon]));
        const ai = new player_1.Player(`chonkbot`, new team_1.Team([Object.assign(Object.create(Object.getPrototypeOf(another_goon)), another_goon)]), true);
        console.log(await battle_1.battle(player, ai, () => true));
    }
    catch (e) {
        console.log(e);
        process.stderr.write(e);
    }
    finally {
        process.exit();
    }
})();
//# sourceMappingURL=main.js.map