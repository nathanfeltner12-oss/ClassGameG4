export class SurvivorPlayer extends Phaser.Physics.Arcade.Sprite {

    private facing: string = 'front';

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'front_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

        this.setVelocity(0);

        if (cursors.left?.isDown) {
            this.setVelocityX(-160);
            this.setTexture('left_run');
            this.facing = 'left';
        }

        else if (cursors.right?.isDown) {
            this.setVelocityX(160);
            this.setTexture('right_run');
            this.facing = 'right';
        }

        else if (cursors.up?.isDown) {
            this.setVelocityY(-160);
            this.setTexture('up_run');
            this.facing = 'up';
        }

        else if (cursors.down?.isDown) {
            this.setVelocityY(160);
            this.setTexture('down_run');
            this.facing = 'down';
        }

        else {
            this.setIdle();
        }
    }

    private setIdle() {
        switch (this.facing) {
            case 'left':
                this.setTexture('left_idle');
                break;
            case 'right':
                this.setTexture('right_idle');
                break;
            case 'up':
                this.setTexture('up_idle');
                break;
            default:
                this.setTexture('front_idle');
        }
    }
}
