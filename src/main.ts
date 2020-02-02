import { battle } from './battle';

//#region Types
import { Goon } from './goon';
//#endregion

//#region Data sources
import * as GoonDataSource from './datasource/goon.json';
//#endregion

import { Player } from './player';
import { Team } from './team';

type NamedData = {
    name: string;
};

const byName = (v: NamedData, n: string) => v.name.toLowerCase() === n.toLowerCase();
const my_goon = new Goon(GoonDataSource.data.find(v => byName(v, `Flame Fella`))!);
const another_goon = new Goon(GoonDataSource.data.find(v => byName(v, `Nikola Tesla`))!);
(async () => {
    try {
        const player = new Player(`Tom`, new Team([my_goon, another_goon]));
        const ai = new Player(`chonkbot`, new Team([Object.assign(Object.create(Object.getPrototypeOf(another_goon)), another_goon)]), true);
        console.log(await battle(player, ai, () => true));
    } catch (e) {
        console.log(e);
        process.stderr.write(e);
    } finally {
        process.exit();
    }
})();
