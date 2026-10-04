import { _decorator, Camera, Component, EventKeyboard, EventMouse, Input, input, Node, Prefab } from 'cc';
import { Player } from './Player';
import { DOUBLE_GUN, FORWARD_REAR_PISTOL, PISTOL, SPREAD_GUN } from './WeaponConfig';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    @property({type:Player, tooltip:'Drop the Player node here'})
    public player:Player | null=null;

    @property({type:Camera, tooltip:'Drop the Main Camera here'})
    public camera:Camera | null=null;

    @property({type:Prefab, tooltip:'Drop the Bullet Prefab here'})
    public defaultBulletPrefab:Prefab | null=null;

    @property({type:Node, tooltip:'Drop the Bullet Container node here'})
    public bulletContainer:Node | null=null;

    start() {
        if(this.player&&this.camera){
            this.player.initialize(this.camera)
        }

        if (this.player && this.defaultBulletPrefab && this.bulletContainer){
            this.player.initializeWeapon(PISTOL, this.defaultBulletPrefab, this.bulletContainer)
        }

        if (this.player) {
            this.player.node.on('WeaponSelect', this.handleWeaponSwap, this)
        }
    }

    protected onDestroy(): void {


        if (this.player){
            this.player.node.off('WeaponSelect', this.handleWeaponSwap, this)
        }
    }

    update(deltaTime: number) {
        
    }

  

    private handleWeaponSwap(WeaponIndex: number){
        switch (WeaponIndex){
            case 1:
                this.player.initializeWeapon(PISTOL, this.defaultBulletPrefab, this.bulletContainer)
                break
            case 2:
                this.player.initializeWeapon(DOUBLE_GUN, this.defaultBulletPrefab, this.bulletContainer)
                break
            case 3:
                this.player.initializeWeapon(FORWARD_REAR_PISTOL, this.defaultBulletPrefab, this.bulletContainer)
                break
            case 4:
                this.player.initializeWeapon(SPREAD_GUN, this.defaultBulletPrefab, this.bulletContainer)
                break
        }
    }
}


