"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Team {
    get goons() {
        return this._goons;
    }
    constructor(goons) {
        this._goons = goons;
    }
    switch(first, second) {
        const finder = (needle) => {
            return (goon) => {
                if (typeof needle === `string`) {
                    return goon.name.toLowerCase() === needle.toLowerCase();
                }
                else {
                    return goon.name === needle.name;
                }
            };
        };
        const indexes = [
            this._goons.findIndex(finder(first)),
            this._goons.findIndex(finder(second))
        ];
        [this._goons[indexes[0]], this._goons[indexes[1]]] = [this._goons[indexes[1]], this._goons[indexes[0]]];
        return this.goons;
    }
    goon(which) {
        return this._goons[Math.round(which)];
    }
    valueOf() {
        return this.goons;
    }
}
exports.Team = Team;
//# sourceMappingURL=team.js.map