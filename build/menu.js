"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Menu {
    static fromObject(obj, is_submenu = false) {
        if (obj.children === undefined) {
            obj.children = [];
        }
        const ret = new Menu(obj.name, obj.display_text, obj.active, obj.cursor_position, obj.children.map(m_obj => Menu.fromObject(Object.assign({ ...m_obj, parent_name: obj.name }), true)), obj.parent_name);
        return !is_submenu ? ret.ensureSingleActive() : ret;
    }
    get active() {
        return this._active;
    }
    set active(active) {
        this._active = active;
        if (active === true) {
            this.deactivateDescendants();
        }
    }
    get cursor_position() {
        return this._cursor_position;
    }
    set cursor_position(where) {
        this._cursor_position = Math.max(0, Math.min(this._children.length - 1, where));
    }
    get children() {
        return this._children;
    }
    set children(children) {
        for (const child of this._children) {
            if (!child.hasActiveDescendant()) {
                child.active = true;
            }
        }
        this._children = children;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(enabled) {
        this._enabled = enabled;
    }
    constructor(name, display_text, active = false, cursor_position = 0, children = [], parent_name, enabled = true) {
        this.name = name;
        this._children = (children === undefined) ? [] : children;
        this.parent_name = parent_name;
        this._cursor_position = Math.max(0, Math.min(this._children.length - 1, cursor_position));
        this.display_text = display_text;
        this._active = active;
        this._enabled = enabled;
    }
    hasActiveDescendant() {
        for (const child of this._children) {
            if (child.active === true || child.hasActiveDescendant()) {
                return true;
            }
        }
        return false;
    }
    addChild(child) {
        if (child.hasActiveDescendant()) {
            if (this.active === true) {
                child.active = false;
                child.deactivateDescendants();
            }
        }
        return this.children.push(child);
    }
    removeChild(child_name) {
        const target = this.children.find(c => c.name === child_name);
        if (target !== undefined) {
            this.children = this.children.slice(this.children.findIndex(c => c.name === child_name), 1);
        }
        return target;
    }
    removeDescendant(descendant_name) {
        let removed = this.removeChild(descendant_name);
        if (removed === undefined) {
            for (const child of this.children) {
                removed = child.removeDescendant(descendant_name);
            }
        }
        return removed;
    }
    findFirstActive() {
        return this._findFirstActive();
    }
    findChildByName(name) {
        if (this.name === name) {
            return this;
        }
        else {
            for (const child of this.children) {
                const found = child.findChildByName(name);
                if (found !== undefined) {
                    return found;
                }
            }
        }
    }
    _findFirstActive() {
        if (this.active === true) {
            return this;
        }
        for (const child of this.children) {
            const found = child.findFirstActive();
            if (found !== undefined) {
                return found;
            }
        }
    }
    ensureSingleActive() {
        const first_active = this.findFirstActive();
        if (first_active !== undefined) {
            this.deactivateAll(first_active.name);
        }
        else {
            this.active = true;
        }
        return this;
    }
    deactivateDescendants(except_name) {
        for (const child of this.children) {
            if (child.name !== except_name) {
                child.active = false;
                child.deactivateDescendants(except_name);
            }
        }
    }
    deactivateAll(except_name) {
        this.active = false;
        this.deactivateDescendants(except_name);
    }
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map