export type AffinityData = {
    name: string,
    weaknesses: string[],
    resistances: string[]
};

export class Affinity {
    private _name: string;
    private _weaknesses: string[];
    private _resistances: string[];

    get name() {
        return this._name;
    }

    get weaknesses() {
        return this._weaknesses;
    }

    get resistances() {
        return this._resistances;
    }

    constructor({ name, weaknesses, resistances }: AffinityData) {
        this._name = name;
        this._weaknesses = weaknesses;
        this._resistances = resistances;
    }
}
