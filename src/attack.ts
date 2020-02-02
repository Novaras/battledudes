import { Affinity } from './affinity';
import * as AffinityData from './datasource/affinity.json';

export type AttackData = {
    name: string,
    power: number,
    accuracy: number | string,
    priority: number,
    affinities: string[]
};

export class Attack {
    private _name: string;
    private _power: number;
    private _accuracy: number;
    private _priority: number;
    private _affinities: Affinity[];

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

    constructor({ name, power, accuracy, priority, affinities }: AttackData) {
        this._name = name;
        this._power = power;
        this._accuracy = accuracy as number;
        this._priority = priority;
        this._affinities = affinities
            .map(aff_name => new Affinity(AffinityData.data.find(aff_data => aff_data.name === aff_name)!));
    }
}
