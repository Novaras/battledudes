"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
class CLI {
    get menu() {
        return this._menu;
    }
    constructor(menu) {
        this._menu = menu;
        this._menu.active = true;
    }
    interact() {
        const cur_menu = this._menu.findFirstActive();
        const display_string = [`${cur_menu.name}\n`];
        for (const [i, node] of cur_menu.children.entries()) {
            display_string.push(`${(i === cur_menu.cursor_position) ? '>' : ''} ${node.display_text}`);
        }
        console.log(`\n`);
        console.log(display_string.join(` `));
        const keypressHnd = async (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            }
            else if (key.name === `escape`) {
                if (cur_menu.parent_name !== undefined) {
                    const parent_menu = this._menu.findChildByName(cur_menu.parent_name);
                    if (parent_menu !== undefined) {
                        parent_menu.active = true;
                    }
                }
            }
            else if (key.name === `return`) {
                const child_menu = cur_menu.children[cur_menu.cursor_position];
                cur_menu.active = false;
                child_menu.active = true;
            }
            else if (key.name === `right`) {
                cur_menu.cursor_position = cur_menu.cursor_position + 1;
            }
            else if (key.name === `left`) {
                cur_menu.cursor_position = cur_menu.cursor_position - 1;
            }
            return this._menu.findFirstActive();
        };
        return new Promise(async (res, rej) => {
            const binder = async (str, key) => {
                console.clear();
                const selection = await keypressHnd(str, key);
                process.stdin.removeListener(`keypress`, binder);
                if (selection.children.length === 0) {
                    res(selection);
                }
                else {
                    res(await this.interact());
                }
            };
            process.stdin.on('keypress', binder);
        });
    }
}
exports.CLI = CLI;
//# sourceMappingURL=cli.js.map