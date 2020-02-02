export type MenuObj = {
    name: string,
    display_text: string,
    parent_name?: string,
    children?: MenuObj[],
    active?: boolean,
    cursor_position?: number
};

export class Menu {

    public static fromObject(obj: MenuObj, is_submenu: boolean = false): Menu {
        if (obj.children === undefined) {
            obj.children = [];
        }
        const ret = new Menu
            (
                obj.name,
                obj.display_text,
                obj.active,
                obj.cursor_position,
                obj.children.map(m_obj => Menu.fromObject(Object.assign({ ...m_obj, parent_name: obj.name }), true)),
                obj.parent_name
            );
        return !is_submenu ? ret.ensureSingleActive() : ret;
    }

    public readonly name: string;
    public parent_name?: string;
    public display_text: string;
    private _children: Menu[];
    private _active: boolean;
    private _cursor_position: number;
    private _enabled: boolean;

    get active() {
        return this._active;
    }

    set active(active: boolean) {
        this._active = active;
        if (active === true) {
            this.deactivateDescendants();
        }
    }

    get cursor_position() {
        return this._cursor_position;
    }

    set cursor_position(where: number) {
        this._cursor_position = Math.max(0, Math.min(this._children.length - 1, where));
    }

    get children() {
        return this._children;
    }

    set children(children: Menu[]) {
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

    set enabled(enabled: boolean) {
        this._enabled = enabled;
    }

    constructor(
        name: string,
        display_text: string,
        active: boolean = false,
        cursor_position: number = 0,
        children: Menu[] = [],
        parent_name?: string,
        enabled: boolean = true
    ) {
        this.name = name;
        this._children = (children === undefined) ? [] : children;
        this.parent_name = parent_name;
        this._cursor_position = Math.max(0, Math.min(this._children.length - 1, cursor_position));
        this.display_text = display_text;
        this._active = active;
        this._enabled = enabled;
    }

    public hasActiveDescendant(): boolean {
        for (const child of this._children) {
            if (child.active === true || child.hasActiveDescendant()) {
                return true;
            }
        }
        return false;
    }

    public addChild(child: Menu): number {
        if (child.hasActiveDescendant()) {
            if (this.active === true) {
                child.active = false;
                child.deactivateDescendants();
            }
        }
        return this.children.push(child);
    }

    public removeChild(child_name: string): Menu | undefined {
        const target = this.children.find(c => c.name === child_name);
        if (target !== undefined) {
            this.children = this.children.slice(this.children.findIndex(c => c.name === child_name), 1);
        }
        return target;
    }

    public removeDescendant(descendant_name: string): Menu | undefined {
        let removed = this.removeChild(descendant_name);
        if (removed === undefined) {
            for (const child of this.children) {
                removed = child.removeDescendant(descendant_name);
            }
        }
        return removed;
    }

    public findFirstActive(): Menu {
        return this._findFirstActive()!;
    }

    public findChildByName(name: string): Menu | undefined {
        if (this.name === name) {
            return this;
        } else {
            for (const child of this.children) {
                const found = child.findChildByName(name);
                if (found !== undefined) {
                    return found;
                }
            }
        }
    }

    private _findFirstActive(): Menu | undefined {
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

    private ensureSingleActive(): Menu {
        const first_active = this.findFirstActive();
        if (first_active !== undefined) {
            this.deactivateAll(first_active.name);
        } else {
            this.active = true;
        }
        return this;
    }

    private deactivateDescendants(except_name?: string): void {
        for (const child of this.children) {
            if (child.name !== except_name) {
                child.active = false;
                child.deactivateDescendants(except_name);
            }
        }
    }

    private deactivateAll(except_name?: string): void {
        this.active = false;
        this.deactivateDescendants(except_name);
    }
}
