import { Assets } from "pixi.js";
import { Block } from "../../Blocks";

export class AssetLoad extends Block {

    constructor(name: string) {
        super(name);
    }

    start() {
        this._loadAssets().then(() => {
            this.end();
        });
    }

    private async _loadAssets(): Promise<void> {
        const baseUrl = '/assets/images/';
        Assets.addBundle('all-assets', {
            'background': `${baseUrl}background.png`,
            'door-closed': `${baseUrl}door-closed.png`,
            'door-open': `${baseUrl}door-open.png`,
            'door-open-shadow': `${baseUrl}door-open-shadow.png`,
            'door-handle': `${baseUrl}door-handle.png`,
            'door-handle-shadow': `${baseUrl}door-handle-shadow.png`,
            'shine': `${baseUrl}shine.png`,
        });

        await Assets.loadBundle('all-assets');
    }
}