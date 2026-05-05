import { Creature, Fly } from "./Creature.js";

/**
 * An alien is a Sprite that is affected by gravity and can die.
 */

export enum BlockState { DEAD, DYING, NORMAL };

export class Block extends Fly {
    constructor(){
        super();
        this.setVelocity(0,0);
    }

}