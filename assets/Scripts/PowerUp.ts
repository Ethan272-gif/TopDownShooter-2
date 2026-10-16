import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, log, Node, Sprite, SpriteFrame } from 'cc';
import { PowerUpType } from './PowerUpConfig';
import { EventBus, GameEvents } from './EventBus';
const { ccclass, property } = _decorator;

@ccclass('PowerUp')
export class PowerUp extends Component {

    private type: PowerUpType=PowerUpType.HEALTH_HEAL
    private extraInfo: number=0
    private isCollected: boolean=false
    private icon: SpriteFrame=null

    public init(assignedType: PowerUpType, providedInfo: number, icon: SpriteFrame | null){
        this.type=assignedType
        this.extraInfo=providedInfo
        this.icon=icon

        if(this.icon){
            let spriteCorp=this.getComponent(Sprite)
            if(spriteCorp){
                spriteCorp.spriteFrame=icon
            }
        }
        
    }

    protected start(): void {
        let collider=this.getComponent(Collider2D)
        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    protected onDestroy(): void {
        let collider=this.getComponent(Collider2D)
        if(collider){
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D,
        contact:IPhysics2DContact | null){
            if(this.isCollected) return

            if(otherCollider.node.name==="Player"){
                let payload={
                    type:this.type,
                    extraInfo: this.extraInfo
                }
                log(`[PowerUp] payload ${payload}`)

                EventBus.emit(GameEvents.POWERUP_COLLECTED, payload)
            }
            this.isCollected=true
        }

        protected update(dt: number): void {
            if(this.isCollected){
                this.node.destroy()
            }
        }


    
}


