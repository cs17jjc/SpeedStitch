class Input {
    constructor(currentStates, namesKeycode) {
        this.currentStates = currentStates;
        this.namesKeycode = namesKeycode;
        this.pKs = [];
        this.cKs = [];
    }
    static new() {
        return new Input(new Map(), new Map());
    }
    attachInput(name, keyCode) {
        this.namesKeycode.set(name, keyCode);
        this.currentStates.set(keyCode, false);
    }
    update(keyCode, value) {
        if (this.currentStates.has(keyCode)) {
            this.currentStates.set(keyCode, value);
        } else if (this.currentStates.has(keyCode.toLowerCase())) {
            this.currentStates.set(keyCode.toLowerCase(), value);
        }
    }
    updateKeyStates() {
        this.pKs = this.cKs;
        const nameKeys = Array.from(this.namesKeycode.keys());
        const namesValue = nameKeys.map(n => { return { name: n, value: this.currentStates.get(this.namesKeycode.get(n)) } });
        this.cKs = namesValue.filter(nv => { return nv.value }).map(nv => { return nv.name });
    }
}