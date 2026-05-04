import { Settings } from "./Settings.js";
import { GameAction } from "./GameAction.js";
import { GameMap } from "./GameMap.js";
import { InputManager } from "./InputManager.js";
import { ResourceManager } from "./ResourceManager.js";
import { CreatureState } from "./sprites/Creature.js";

export var GRAVITY = 0.002;
var FONT_SIZE = 24;

export enum STATE {
    Loading,
    Menu,
    Running,
    Finished
}

var GameManager = /** @class */ (function () {
    function GameManager(this: any) {
        this.img1 = loadImage("assets/images/medallion1.png");
        this.img2 = loadImage("assets/images/life1.png");

        this.level = 0;
        this.oldState = STATE.Loading;
        this.gameState = STATE.Loading;

        this.resources = new ResourceManager("assets/assets.json");
        this.inputManager = new InputManager();
        this.settings = new Settings();

        this.moveRight = new GameAction();
        this.moveLeft = new GameAction();
        this.jump = new GameAction();
        this.stop = new GameAction();
        this.restart = new GameAction();

        
        this.dash = new GameAction();
        this.isDashing = false;
        this.dashTime = 0;
        this.dashDuration = 12; // frames

       
        this.lastDir = 1; // 1 = right, -1 = left
    }

    GameManager.prototype.draw = function () {
        switch (this.gameState) {

            case STATE.Running: {
                textStyle();
                this.map.draw();

                fill(150, 150, 200, 150);
                rect(10, 10, 55, 85);

                fill(255, 255, 255);
                image(this.img1, 15, 15, 32, 32);
                image(this.img2, 8, 41, 48, 48);

                textSize(12);
                text(this.map.lives, 45, 70);
                text(this.map.medallions, 45, 36);
                break;
            }

            case STATE.Menu: {
                this.map.draw();
                this.settings.showMenu();
                break;
            }

            case STATE.Loading: {
                break;
            }

            case STATE.Finished: {
                fill(255, 0, 0);
                rect(0, 0, 800, 600);

                fill(0, 0, 255);
                rect(30, 30, 740, 540);

                fill(0, 0, 0);
                rect(60, 60, 680, 480);

                textSize(64);
                fill(227, 197, 0);
                text("You Win!", 265, 200);

                textSize(32);
                text("Original Creators of Apollo 18", 250, 280);

                textSize(16);
                text("Henry Roeth", 340, 330);
                text("Tristan Adamson", 324, 405);
                text("Aidan Griffin", 340, 480);

                text("Reload server to restart!", 308, 100);
                text("Editted for Class by Daniel Gavazzi", 265, 525);
                break;
            }
        }
    };

    GameManager.prototype.update = function () {
        switch (this.gameState) {

            case STATE.Running: {
                this.map.update();
                this.inputManager.checkInput();
                this.processActions();
                break;
            }

            case STATE.Menu: {
                break;
            }

            case STATE.Loading: {
                if (this.resources.isLoaded()) {
                    this.map = new GameMap(this.level, this.resources, this.settings, this);
                    this.settings.setMusic(this.resources.getLoad("music"));

                    this.inputManager.setGameAction(this.moveRight, RIGHT_ARROW);
                    this.inputManager.setGameAction(this.moveLeft, LEFT_ARROW);
                    this.inputManager.setGameAction(this.jump, UP_ARROW);

                    this.inputManager.setGameAction(this.restart, 82);

                    // ✅ DASH KEY (Shift)
                    this.inputManager.setGameAction(this.dash, 16);

                    this.oldState = STATE.Running;
                    this.gameState = STATE.Menu;
                }
                break;
            }
        }
    };

    GameManager.prototype.processActions = function () {

        var vel = this.map.player.getVelocity();

        // track last direction
        if (this.moveRight.isPressed()) this.lastDir = 1;
        if (this.moveLeft.isPressed()) this.lastDir = -1;

        // ✅ START DASH
        if (this.dash.isBeginPress() && 
            this.map.player.getState() == CreatureState.NORMAL && 
            !this.isDashing) {

            this.isDashing = true;
            this.dashTime = this.dashDuration;

            vel.x = this.lastDir * this.map.player.getMaxSpeed() * 3;
        }

        // ✅ DASH ACTIVE
        if (this.isDashing) {
            this.dashTime--;

            // keep velocity during dash
            vel.x = this.lastDir * this.map.player.getMaxSpeed() * 3;

            if (this.dashTime <= 0) {
                this.isDashing = false;
            }
        } else {
            // NORMAL MOVEMENT
            vel.x = 0;

            if (this.moveRight.isPressed() && this.map.player.getState() == CreatureState.NORMAL) {
                vel.x = this.map.player.getMaxSpeed();
            }

            if (this.moveLeft.isPressed() && this.map.player.getState() == CreatureState.NORMAL) {
                vel.x = -this.map.player.getMaxSpeed();
            }
        }

        this.map.player.setVelocity(vel.x, vel.y);

        // Jump
        if (this.jump.isPressed() && this.map.player.getState() == CreatureState.NORMAL) {
            this.map.player.jump(false);
        }

        // Restart
        if (this.restart.isBeginPress()) {
            this.level = 0;
            this.map.initialize();
            this.map.medallions = 0;
            this.gameState = STATE.Running;
        }
    };

    GameManager.prototype.toggleFullScreen = function () {
        this.settings.toggleFullScreen();
    };

    GameManager.prototype.toggleMenu = function () {
        if (this.gameState == STATE.Menu) {
            this.gameState = this.oldState;

            if (this.gameState != STATE.Menu) {
                this.settings.hideMenu();
            } else {
                this.settings.showMenu();
            }
        } else {
            this.oldState = this.gameState;
            this.gameState = STATE.Menu;
            this.settings.showMenu();
        }
    };

    return GameManager;
}());

export { GameManager };