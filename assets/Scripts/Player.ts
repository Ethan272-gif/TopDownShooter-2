import { _decorator, Camera, Component, EventKeyboard, EventMouse, Node, Prefab } from 'cc';
import { PlayerMovementSystem } from './PlayerMovementSystem';
import { PlayerWeaponSystem } from './PlayerWeaponSystem';
import { PlayerInputSystem } from './PlayerInputSystem';
import { WeaponConfig } from './WeaponConfig';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    private inputSystem: PlayerInputSystem | null=null;
    private movementSystem: PlayerMovementSystem | null=null;
    private weaponSystem: PlayerWeaponSystem | null=null;
    public mainCamera: Camera | null=null;

    protected onLoad(): void {
        this.inputSystem=this.getComponent(PlayerInputSystem)
        this.movementSystem=this.getComponent(PlayerMovementSystem)
        this.weaponSystem=this.getComponent(PlayerWeaponSystem)
    }

    public initialize(camera: Camera): void{
        this.mainCamera=camera
    }

    public initializeWeapon(config: WeaponConfig, bulletPrefab: Prefab, bulletContainer: Node){
       if (this.weaponSystem){
        this.weaponSystem.equipWeapon(config, bulletPrefab, bulletContainer, this.node)
       } 
    }

    start() {
        if (this.inputSystem){
            this.inputSystem.initialize(this.mainCamera)
        }
    }

    protected update(deltaTime: number) {
        if (this.inputSystem && this.movementSystem){
            let moveDir=this.inputSystem.getMoveDirection()
            this.movementSystem.updateMovement(moveDir)
            let targetAngle=this.inputSystem.getRotationAngle()
            this.movementSystem.updateRotation(targetAngle)
        }

        if (this.inputSystem && this.weaponSystem){
            let isFiring=this.inputSystem.isShooting
            this.weaponSystem.processFiring(isFiring,this.node.angle)
            if (this.inputSystem.getSingleShotIntent()){
                this.weaponSystem.triggerSingleShot(this.node.angle)
            }
        }
    }

}


