import { _decorator, Component, find, input, Node, Vec2 } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';
import { EnemyConfig, IntentConfig, MovementConfig } from './EnemyConfig';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    public static activeEnemies: Enemy[]=[]


    private inputSystem: EnemyInputSystem | null=null
    private movementSystem: EnemyMovementSystem | null=null
    private healthSystem: HealthSystem | null=null
    private intentConfig: IntentConfig
    private movementConfig: MovementConfig

    private targetNode: Node | null=null

    protected onLoad(): void {

        Enemy.activeEnemies.push(this)
    }

    public init(enemyConfig: EnemyConfig){
        if(!this.inputSystem){
            this.inputSystem=this.getComponent(EnemyInputSystem)
        }
        if(!this.movementSystem){
            this.movementSystem=this.getComponent(EnemyMovementSystem)
        }
        if(!this.healthSystem){
            this.healthSystem=this.getComponent(HealthSystem)
        }

        this.node.setScale(enemyConfig.scale.x,enemyConfig.scale.y)

        
        if(this.healthSystem) {
            this.healthSystem.initialize(20)
        }
          
        if (this.inputSystem){
            this.targetNode=find("Canvas/Player")
            let wanderPoints=this.node.getParent().getChildByName("WanderNodes").children.map(
                child=>new Vec2(child.worldPosition.x,child.worldPosition.y)
            )
            this.inputSystem.initialize(this.targetNode, wanderPoints, enemyConfig.intent)
            
        }

        if(this.movementSystem){
            this.movementSystem.init(enemyConfig.intent.maxSpeed, enemyConfig.moving)
        }

        if(this.healthSystem){
            this.healthSystem.initialize(enemyConfig.health)
        }

        }



    update(deltaTime: number) {
        if (this.healthSystem){
            if (this.healthSystem.isDead){
                this.node.destroy()
            }
        }

        // if(!this.targetNode){
        //     this.targetNode=find("Canvas/Player")
        //     this.inputSystem.initialize(this.targetNode)
        // }

        if (this.inputSystem && this.movementSystem){

            let isSlow=this.movementSystem.isMovingSlowly()
            this.inputSystem.isMovingSlowly=isSlow

            this.inputSystem.processFSM(deltaTime)

            let moveDir=this.inputSystem.getMoveDirection()

            this.movementSystem.updateMovement(moveDir)

            let targetAngle=this.inputSystem.getRotationAngle()
            this.movementSystem.updateRotation(targetAngle)
        }

        if (this.inputSystem.stateDebugLabel){
            this.inputSystem.stateDebugLabel.node.angle= -this.node.angle
        }

    }

    protected onDestroy(): void {
        let index=Enemy.activeEnemies.indexOf(this)
        if(index>-1){
            Enemy.activeEnemies.splice(index, 1)
        }
    }
}


