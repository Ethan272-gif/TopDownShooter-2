import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, NodePool, RigidBody2D, Vec2 } from 'cc';
import { HealthSystem } from './HealthSystem';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    @property({tooltip: 'How many seconds until despawn'})
    public maxLifeSpan: number=2.0

    private myPool: NodePool | null=null
    private lifeTimer: number=0
    private isHit: boolean=false
    private damageAmount: number=1

    private readonly GROUP_PLAYER_BULLET=1<<3
    private readonly GROUP_ENEMY_BULLET=1<<4


    public initialize(pool: NodePool, velocity: Vec2, damage: number, isPlayerWeapon:boolean): void{
        this.myPool=pool
        this.damageAmount=damage
        this.lifeTimer=0

        let rigidBody=this.getComponent(RigidBody2D)
        if (rigidBody){
            rigidBody.linearVelocity=velocity
        }
        let collider=this.getComponent(Collider2D)
        if (collider){
            collider.group=isPlayerWeapon ? this.GROUP_PLAYER_BULLET : this.GROUP_ENEMY_BULLET
        }
    }

    start() {
        let collider=this.getComponent(Collider2D)
        if (collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        if (this.isHit) return

        let healthComp=otherCollider.node.getComponent(HealthSystem)

        if (healthComp){
            healthComp.takeDamage(this.damageAmount)
        }
        
        this.isHit=true
    }

    update(deltaTime: number) {
        if (this.isHit){
            this.returnPool()
            return
        }

        this.lifeTimer+=deltaTime
        if (this.lifeTimer>=this.maxLifeSpan){
            this.returnPool()
        }
    }

    private returnPool(){
        if(!this.node.active) return

        this.isHit=false

        if (this.myPool){
            let rigidBody=this.getComponent(RigidBody2D)
            if(rigidBody){
                rigidBody.linearVelocity=Vec2.ZERO
            }

            this.node.active=false
            this.myPool.put(this.node)
        }
        else{
            this.node.destroy()
        }
    }
}


