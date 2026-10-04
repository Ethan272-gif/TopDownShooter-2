import { _decorator, Component, find, input, Node } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    private inputSystem: EnemyInputSystem | null=null
    private movementSystem: EnemyMovementSystem | null=null
    private healthSystem: HealthSystem | null=null
    private targetNode: Node | null=null

    protected onLoad(): void {
        this.inputSystem=this.getComponent(EnemyInputSystem)
        this.movementSystem=this.getComponent(EnemyMovementSystem)
        this.healthSystem=this.getComponent(HealthSystem)

        if(this.healthSystem) {
            this.healthSystem.initialize(20)
        }
        
        if(this.inputSystem){
            this.targetNode=find("Canvas/Player")
            this.inputSystem.initialize(this.targetNode)
        }
    }

    start() {

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

        if (this.inputSystem && this.movementSystem && this.targetNode){

            let moveDir=this.inputSystem.getMoveDirection()

            this.movementSystem.updateMovement(moveDir)

            let targetAngle=this.inputSystem.getRotationAngle()
            this.movementSystem.updateRotation(targetAngle)
        }
    }
}


