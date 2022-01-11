import { ButtonConfig } from '../../../config'
export default class Button {
    private readonly config: ButtonConfig
    constructor(userConfig: ButtonConfig) {
        const config = this.config = userConfig
    }
}