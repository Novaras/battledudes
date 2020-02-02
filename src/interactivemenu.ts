import * as readline from 'readline';
import { Menu } from './menu';

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode!(true);

export const menuInteract = async (menu: Menu, static_text?: string): Promise<Menu> => {
    const cur_menu = menu.findFirstActive();
    console.log(cur_menu.cursor_position);
    const display_string = [`${cur_menu.name}\n`];
    for (const [i, node] of cur_menu.children.entries()) {
        display_string.push(`${(i === cur_menu.cursor_position) ? '>' : ''} ${node.display_text}`);
    }

    console.log(`${static_text}\n${display_string.join(` `)}`);

    const keypressHnd: (str: string, key: readline.Key) => Promise<Menu> = async (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else if (key.name === `escape`) {
            if (cur_menu.parent_name !== undefined) {
                const parent_menu = menu.findChildByName(cur_menu.parent_name);
                if (parent_menu !== undefined) {
                    parent_menu.active = true;
                }
            }
        } else if (key.name === `return`) {
            const child_menu = cur_menu.children[cur_menu.cursor_position];
            if (child_menu.enabled === true) {
                cur_menu.active = false;
                child_menu.active = true;
            }
        } else if (key.name === `right`) {
            cur_menu.cursor_position = cur_menu.cursor_position + 1;
        } else if (key.name === `left`) {
            cur_menu.cursor_position = cur_menu.cursor_position - 1;
        }
        console.clear();
        return menu.findFirstActive();
    };
    return new Promise(async (res, rej) => {
        const binder: (str: string, key: readline.Key) => Promise<void> = async (str: string, key: readline.Key) => {
            const selection = await keypressHnd(str, key);
            process.stdin.removeListener(`keypress`, binder);
            if (selection.children.length === 0 && selection.enabled) {
                res(selection);
            } else {
                res(await menuInteract(menu, static_text));
            }
        };
        process.stdin.on('keypress', binder);
    });
};
