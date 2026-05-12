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

export class FriendlyProjectile extends Projectile {
    
    remove:boolean;
    followPlayer:boolean;
    MAX_TIME: number;
    currentTime: number;

    constructor() {
        super();
        this.remove=false;
        this.followPlayer=false;
        this.MAX_TIME = 3000;
        this,this.currentTime = 0;
    }

    clearFollowPlayer() {
        this.followPlayer=false;
    }

    setFollowPlayer() {
        this.followPlayer=true;
    }

    update(elapsedTime: number): void {
        super.update(elapsedTime);

        
        this.currentTime += elapsedTime;

        
        if (this.currentTime >= this.MAX_TIME) {
            this.remove = true;
        }
            
    }
    checkRemove(){
        return this.remove;
    }
}
