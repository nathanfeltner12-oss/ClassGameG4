import { Sprite } from './Sprite.js';


export class Projectile extends Sprite {

    constructor() {
        super();
        this.setVelocity(0.55,0);
    }

    update(elapsedTime: number) {
        super.update(elapsedTime);
        this.position.x += this.velocity.x * elapsedTime;
        this.position.y += this.velocity.y * elapsedTime;
    }

    isFlying() {
        return true;
    }

    setRight(isRight:boolean) {
        if (isRight) {
            this.velocity.x=Math.abs(this.velocity.x);
        } else {
            this.velocity.x=-Math.abs(this.velocity.x);
        }
    }

}

export class EnemyProjectile extends Projectile {
    
    followPlayer:boolean;

    constructor() {
        super();
        this.followPlayer=false;
    }

    clearFollowPlayer() {
        this.followPlayer=false;
    }

    setFollowPlayer() {
        this.followPlayer=true;
    }
}