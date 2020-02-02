import { Goon } from './goon';
import { Team } from './team';

export class Player {
    private _name: string;
    private _team: Team;
    private _is_AI: boolean;

    get name(): string {
        return this._name;
    }

    get team(): Team {
        return this._team;
    }

    get is_AI(): boolean {
        return this._is_AI;
    }

    constructor(name: string, team: Team, is_AI: boolean = false) {
        this._name = name;
        this._team = team;
        this._is_AI = is_AI;
    }
}
