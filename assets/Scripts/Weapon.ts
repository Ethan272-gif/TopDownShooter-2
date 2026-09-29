import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
import { Barrel } from './Barrel';
import { FireMode, WeaponConfig } from './WeaponConfig';
const { ccclass, property } = _decorator;

@ccclass('Weapon')
export class Weapon extends Component {

    private bulletPrefab: Prefab | null=null
    private magazinePool:NodePool=new NodePool()
    private barrels: Barrel[]=[]
    private bulletContainer: Node | null=null

    private fireMode:FireMode=FireMode.SEMI_AUTO
    private fireRate: number=0.1
    private bulletSpeed: number=25
    private damageAmount: number=1
    private fireCoolDown: number=0
    private burstCount: number | null=null
    private burstDelay: number | null=null
    private burstTimer: number=0
    private pendingBurstShots:number=0
    private isPlayerWeapon:boolean=null

    public get currentFireMode(): FireMode {
        return this.fireMode
    }

    public initialize(config: WeaponConfig, prefab: Prefab, container: Node, isPlayerWeapon:boolean){
        this.bulletPrefab=prefab
        this.bulletContainer=container
        this.fireMode=config.fireMode
        this.fireRate=config.fireRate
        this.bulletSpeed=config.bulletSpeed
        this.damageAmount=config.damageAmount
        this.burstCount=config.burstCount ?? 0
        this.burstDelay=config.burstDelay ?? 0
        this.isPlayerWeapon=isPlayerWeapon

        this.setUpObjectPool(config);
        this.setUpBarrels(config);
    }

    private setUpBarrels(config: WeaponConfig) {
        for (let i = 0; i < config.barrels.length; i++) {
            let barrelData = config.barrels[i];
            let barrelNode = new Node('Barrel_${i}');
            barrelNode.setParent(this.node);

            let barrelComp = barrelNode.addComponent(Barrel);
            barrelComp.initialize(barrelData.pos, barrelData.angles, barrelData.size);
            this.barrels.push(barrelComp);
        }
    }

    private setUpObjectPool(config: WeaponConfig) {
        for (let i = 0; i < config.magazineSize; i++) {
            let bulletNode = instantiate(this.bulletPrefab);
            bulletNode.active = false;
            this.magazinePool.put(bulletNode);
        }
    }

    update(dt: number) {
        if (this.fireCoolDown>0) this.fireCoolDown-=dt

        if (this.pendingBurstShots>0){
            this.burstTimer-=dt
            if (this.burstTimer<=0){
                let angle=this.node.parent ? this.node.parent.angle : 0
                this.executeFireLogic(angle)
                this.pendingBurstShots--
                this.burstTimer=this.burstDelay
            }
        }

    }

    public triggerPulled(playerAngle: number){
        if (this.fireCoolDown>0 || this.pendingBurstShots>0) return

        if(this.fireMode===FireMode.BURST){
            this.pendingBurstShots=this.burstCount
            this.burstTimer=0
            this.fireCoolDown=this.fireRate
        }
        else{
            this.executeFireLogic(playerAngle)
            this.fireCoolDown=this.fireRate
        }
    }

    private executeFireLogic(playerAngle: number){
        for (let barrel of this.barrels){
            let bulletNode=this.magazinePool.get()
            if (!bulletNode) return
            barrel.shoot(bulletNode, this.bulletContainer,
                playerAngle, this.bulletSpeed,
                this.magazinePool,this.damageAmount, this.isPlayerWeapon)
        }
    }
}


