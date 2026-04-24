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
            'door-opening': `${baseUrl}door-opening.png`,
            'door-open': `${baseUrl}door-open.png`,
            'door-handle': `${baseUrl}door-handle.png`,
            'treasure': `${baseUrl}treasure.png`,
        });

        await Assets.loadBundle('all-assets');
    }
}