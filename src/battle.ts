import { Attack } from './attack';
import { Goon } from './goon';
import { Menu } from './menu';
import { Player } from './player';
import { Team } from './team';

import { menuInteract } from './interactivemenu';

import * as AffinityData from './datasource/affinity.json';
import * as AttackData from './datasource/attack.json';
import * as BattleMenuShell from './menus/battle.json';

const allDefeated: (team: Team) => boolean = (team) => {
    return team.goons.every(g => g.HP === 0);
};

type PlayerStat = {
    [key: string]: number | string | Player,
    player: Player
    damage_dealt: number,
    damage_taken: number
};

type TurnReport = {
    [key: string]: PlayerStat[],
    players: PlayerStat[]
};

type BattleReport = {
    [key: string]: PlayerStat | PlayerStat[] | number | TurnReport[],
    winner: PlayerStat,
    losers: PlayerStat[],
    turns_taken: number,
    turn_reports: TurnReport[]
};

type WinCondition = (...params: any[]) => boolean;

export const battle: (a: Player, b: Player, win_condition: WinCondition) => Promise<BattleReport> = async (a, b, win_condition) => {

    const turn_reports: TurnReport[] = [];
    while (!allDefeated(a.team) && !allDefeated(b.team)) {
        if (turn_reports.length > 0) {
            await new Promise((res) => {
                process.stdin.on(`keypress`, () => {
                    console.clear();
                    res();
                });
            });
        }
        turn_reports.push(await turn([a, b], Menu.fromObject(BattleMenuShell)));
    }

    const winning_player = [a, b].find(p => !allDefeated(p.team))!;
    console.log(winning_player);

    return {
        winner: {
            player: winning_player,
            damage_dealt: turn_reports.reduce((acc, v) => acc + v.players.find(ps => ps.player.name === winning_player.name)!.damage_dealt, 0),
            damage_taken: turn_reports.reduce((acc, v) => acc + v.players.find(ps => ps.player.name === winning_player.name)!.damage_taken, 0)
        },
        losers: [],
        turns_taken: turn_reports.length,
        turn_reports: [...turn_reports]
    };
};

const getPlayerCommand = (player: Player, menu: Menu, static_text?: string) => {
    if (player.is_AI) {
        const atk = player.team.goons[0].attacks[0]; // smart ai stuff goes here later
        return Menu.fromObject({
            name: atk.name.toLowerCase(),
            display_text: atk.name,
            parent_name: `attack`
        });
    } else {
        menu.findChildByName(`attack`)!.children = player.team.goons[0].attacks.map(attack => Menu.fromObject({
            name: attack.name.toLowerCase(),
            display_text: attack.name,
            parent_name: `attack`
        }, true));
        const switch_menu = menu.findChildByName(`switch`)!;
        switch_menu.children = player.team.goons
            .slice(1)
            .filter(goon => goon.HP > 0)
            .map(goon => Menu.fromObject({
                name: goon.name.toLowerCase(),
                display_text: goon.name,
                parent_name: `switch`
            }, true));
        if (switch_menu.children.length === 0) {
            switch_menu.enabled = false;
        }
        return menuInteract(menu, static_text);
    }
};

const turn = async (players: Player[], menu_shell: Menu): Promise<TurnReport> => {
    const report: TurnReport = {
        players: players.map(p => {
            return {
                player: p,
                damage_dealt: 0,
                damage_taken: 0
            };
        })
    };
    players = players.sort((a, b) => {
        if (a.team.goons[0].speed > b.team.goons[0].speed) {
            return -1;
        } else if (a.team.goons[0].speed < b.team.goons[0].speed) {
            return 1;
        }
        return 0;
    });
    for (const player of players) {
        if (!allDefeated(player.team)) {
            for (const other_player of players.filter(p => !Object.is(p, player))) {
                const damage_calc = damageCalc(player.team.goons[0], other_player.team.goons[0]);
                const static_text = (() => {
                    return players.map(p => {
                        return `${p.name}:\n
                        Team: ${p.team.goons.map(g => `[${g.HP > 0 ? `x` : ` `}]`)}\n
                        Active: ${p.team.goons[0].name} (${p.team.goons[0].HP}/${p.team.goons[0].max_HP})`;
                    }).join(`\n`);
                })();
                const selection = await getPlayerCommand(player, menu_shell, static_text);
                if (selection.parent_name === `attack`) {
                    const attack = player.team.goons[0].attacks.find(atk => atk.name.toLowerCase() === selection.name.toLowerCase());
                    if (attack !== undefined) {
                        console.log(`${player.team.goons[0].name} used ${attack.name}!`);
                        const damage = damage_calc(attack);
                        other_player.team.goons[0].takeDamage(damage);
                        report.players.find(p => p.player.name === player.name)!.damage_dealt += damage;
                        report.players.find(p => p.player.name === other_player.name)!.damage_taken += damage;
                        console.log(`${other_player.team.goons[0].name} took ${damage} damage!`);
                        if (other_player.team.goons[0].HP === 0) {
                            console.log(`${other_player.team.goons[0].name} fainted!`);
                            const next_goon = other_player.team.goons.find(g => g.HP > 0);
                            if (next_goon === undefined) {
                                console.log(`${other_player.name} is out of usable goons!`);
                            } else {
                                other_player.team.switch(other_player.team.goons[0], next_goon);
                            }
                        }
                        console.log(`-----`);
                    }
                } else if (selection.parent_name === `switch`) {
                    player.team.switch(selection.name.toLowerCase(), player.team.goons[0]);
                }
            }
        }
    }
    return report;
};

const damageCalc = (attacker: Goon, defender: Goon): (attack: Attack) => number => {
    return (attack: Attack) => {
        const affinityMult = (): number => {
            let mult = 1;
            for (const d_aff of defender.affinities) {
                for (const a_aff of attacker.affinities) {
                    if (d_aff.weaknesses.includes(a_aff.name)) {
                        mult *= 2;
                    }
                    if (d_aff.resistances.includes(a_aff.name)) {
                        mult *= 0.5;
                    }
                }
            }
            return mult;
        };
        const stabMult = (): number => {
            let mult = 1;
            for (const attacker_aff of attacker.affinities) {
                for (const attack_aff of attack.affinities) {
                    mult *= attacker_aff.name === attack_aff.name ? 1.3 : 1;
                }
            }
            return mult;
        };
        return ((attack.power * (attacker.attack / Math.max(1, defender.defence))) / 5) * affinityMult() * stabMult();
    };
};
