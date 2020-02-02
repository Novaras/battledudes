import { Goon } from './goon';

export class Team {
    private _goons: Goon[];

    get goons() {
        return this._goons;
    }

    constructor(goons: Goon[]) {
        this._goons = goons;
    }

    public switch(first: string | Goon, second: string | Goon): Goon[] {
        const finder = (needle: string | Goon) => {
            return (goon: Goon) => {
                if (typeof needle === `string`) {
                    return goon.name.toLowerCase() === needle.toLowerCase();
                } else {
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

    public goon(which: number) {
        return this._goons[Math.round(which)];
    }

    public valueOf(): Goon[] {
        return this.goons;
    }
}
