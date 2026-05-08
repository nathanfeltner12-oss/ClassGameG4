import { Fly } from "./Creature.js";

/**
 * This Class is for the Bullet Object that will be shot out by the Main Player and 
 * Opponenets inside the Game. 
 */

export class Bullet extends Fly {

    direction: number = 1; // 1 = right, -1 = left
    speed: number = 0.4;

    constructor(direction: number = 1) {
        super();
        this.direction = direction;
    }

    setDirection(direction: number){
        this.direction = direction;
    }

    override getMaxSpeed() {
        return this.speed;
    }

    override wakeUp() {
        // bullets should NOT wander like creatures
        this.setVelocity(this.speed * this.direction, 0);
    }

    override update(deltaTime: number) {
        super.update(deltaTime);

        // keep bullet moving constantly
        this.setVelocity(this.speed * this.direction, 0);

        // optional: remove if dead or stuck
        if (this.getState() == CreatureState.DEAD) {
            this.setVelocity(0, 0);
        }
    }
}