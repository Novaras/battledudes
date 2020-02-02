import { Affinity } from './affinity';
import { Attack } from './attack';

import * as AffinityData from './datasource/affinity.json';
import * as AttackData from './datasource/attack.json';

type GoonData = {
    name: string,
    HP: number,
    attack: number,
    defence: number,
    speed: number,
    affinities: string[],
    attacks: string[]
};

export class Goon {
    //#region properties
    private _name: string;
    private _HP: number;
    private _max_HP: number;
    private _attack: number;
    private _defence: number;
    private _speed: number;
    private _affinities: Affinity[];
    private _attacks: Attack[];
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

    constructor({ name, HP, attack, defence, speed, affinities, attacks }: GoonData) {
        this._name = name;
        this._max_HP = HP;
        this._HP = HP;
        this._attack = attack;
        this._defence = defence;
        this._speed = speed;
        this._affinities = affinities
            .map(aff_name => new Affinity(AffinityData.data.find(aff_data => aff_data.name.toLowerCase() === aff_name.toLowerCase())!));
        this._attacks = attacks
            .map(atk_name => new Attack(AttackData.data.find(atk_data => atk_data.name.toLowerCase() === atk_name.toLowerCase())!));
    }

    public takeDamage(amount: number) {
        this._HP = Math.max(0, this.HP - amount);
    }
}
