import { Settings } from "./Settings.js";
import { GameAction } from "./GameAction.js";
import { GameMap } from "./GameMap.js";
import { InputManager } from "./InputManager.js";
import { ResourceManager } from "./ResourceManager.js";
import { CreatureState } from "./sprites/Creature.js";

export const GRAVITY = 0.002;
const FONT_SIZE = 24;

export enum STATE {
    Loading,
    Menu,
    Running,
    Finished
}

export class GameManager {

    img1: any;
    img2: any;

    level: number;
    oldState: STATE;
    gameState: STATE;

    resources: ResourceManager;
    inputManager: InputManager;
    settings: Settings;
    map!: GameMap;

    moveRight: GameAction;
    moveLeft: GameAction;
    jump: GameAction;
    stop: GameAction;
    restart: GameAction;
    dash: GameAction;
    talk: GameAction;
    

    isDashing: boolean;
    dashTime: number;
    dashDuration: number;

    lastDir: number;

    constructor() {

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
        this.talk = new GameAction();
        this.isDashing = false;
        this.dashTime = 0;
        this.dashDuration = 12;
        this.lastDir = 1;
    }

    draw(): void {

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

            case STATE.Loading:
                break;

            case STATE.Finished: {
                fill(255, 0, 0);
                rect(0, 0, 800, 600);
                break;
            }
        }
    }

    update(): void {

        switch (this.gameState) {

            case STATE.Running: {
                this.map.update();
                this.inputManager.checkInput();
                this.processActions();
                break;
            }

            case STATE.Menu:
                break;

            case STATE.Loading: {

                if (this.resources.isLoaded()) {

                    this.map = new GameMap(this.level, this.resources, this.settings, this);
                    this.settings.setMusic(this.resources.getLoad("music"));

                    this.inputManager.setGameAction(this.moveRight, RIGHT_ARROW);
                    this.inputManager.setGameAction(this.moveLeft, LEFT_ARROW);
                    this.inputManager.setGameAction(this.jump, UP_ARROW);
                    this.inputManager.setGameAction(this.restart, 82);
                    this.inputManager.setGameAction(this.dash, 16);

                    this.oldState = STATE.Running;
                    this.gameState = STATE.Menu;
                }

                break;
            }
        }
    }

    processActions(): void {

        const vel = this.map.player.getVelocity();

        if (this.moveRight.isPressed()) this.lastDir = 1;
        if (this.moveLeft.isPressed()) this.lastDir = -1;

        if (
            this.dash.isBeginPress() &&
            this.map.player.getState() == CreatureState.NORMAL &&
            !this.isDashing
        ) {
            this.isDashing = true;
            this.dashTime = this.dashDuration;
            vel.x = this.lastDir * this.map.player.getMaxSpeed() * 3;
            if(this.dash.isPressed() && this.map.player.getState() == CreatureState.NORMAL){
                this.map.dash.play();
            }
        }

        if (this.isDashing) {

            this.dashTime--;
            vel.x = this.lastDir * this.map.player.getMaxSpeed() * 3;

            if (this.dashTime <= 0) this.isDashing = false;

        } else {

            vel.x = 0;

            if (this.moveRight.isPressed() && this.map.player.getState() == CreatureState.NORMAL) {
                vel.x = this.map.player.getMaxSpeed();
            }

            if (this.moveLeft.isPressed() && this.map.player.getState() == CreatureState.NORMAL) {
                vel.x = -this.map.player.getMaxSpeed();
            }
        }

        this.map.player.setVelocity(vel.x, vel.y);

        if (this.jump.isPressed() && this.map.player.getState() == CreatureState.NORMAL) {
            if(this.map.player.onGround){
                this.map.jump.play();
            }
            this.map.player.jump(false);
        }

        if (this.restart.isBeginPress()) {
            this.level = 0;
            this.map.initialize();
            this.map.medallions = 0;
            this.gameState = STATE.Running;
        }
    }

    toggleFullScreen(): void {
        this.settings.toggleFullScreen();
    }

    toggleMenu(): void {

        if (this.gameState == STATE.Menu) {
            this.gameState = this.oldState;
            this.settings.hideMenu();
        } else {
            this.oldState = this.gameState;
            this.gameState = STATE.Menu;
            this.settings.showMenu();
        }
    }
}