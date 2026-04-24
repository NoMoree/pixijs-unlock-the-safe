import { Block } from "../../Blocks";
import { SafeDoor } from "../../../prefabs/SafeDoor";
import { Sprite } from "pixi.js";

export class OpenDoorBlock extends Block {
    private door: SafeDoor;
    private treasure: Sprite;
    constructor(name: string, door: SafeDoor, treasure: Sprite) {
        super(name);
        this.door = door;
        this.treasure = treasure;
    }

    async start() {
        await this.door.openDoor(this.treasure);
        this.end();
    }
}