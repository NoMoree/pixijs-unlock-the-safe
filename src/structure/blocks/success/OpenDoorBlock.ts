import { Block } from "../../Blocks";
import { SafeDoor } from "../../../prefabs/SafeDoor";

export class OpenDoorBlock extends Block {
    private door: SafeDoor;
    constructor(name: string, door: SafeDoor) {
        super(name);
        this.door = door;
    }

    async start() {
        await this.door.openDoor();
        this.end();
    }
}