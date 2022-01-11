class Main {
    version
    atomic
    constructor() {
        this.atomic = new Atomic()
        this.version = this.atomic.version
    }
}

new Main()
