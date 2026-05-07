import { Fly } from "./Creature.js";
import { CreatureState } from "./Creature.js";

/**
 * Bullet projectile fired by player or enemies
 */
export class Bullet extends Fly {

    direction: number = 1; // 1 = right, -1 = left
    speed: number = 0.4;

    constructor(direction: number = 1) {
        super();
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