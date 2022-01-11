


/**
 * @module Atomic
 * @class
 * @constructor
 */
export default class Atomic {
    
    static get version(): string {
        return __VERSION__
    }

	constructor() {
        console.log("CONSTRUCTOR")
    }
}