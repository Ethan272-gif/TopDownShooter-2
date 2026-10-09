import { Vec2 } from "cc";
import { EnemyInputSystem } from "./EnemyInputSystem";
import { IState } from "./IState";

export class ChaseState implements IState {

    private stuckTimer: number=0
    private stuckThresholdTime: number=1
    private attackRange: number=50

    enter(brain: EnemyInputSystem): void {
        this.stuckTimer=0
        
    }
    execute(brain: EnemyInputSystem, dt: number): void {
        
        if(!brain.targetNode) return

        let myPos=new Vec2(brain.node.worldPosition.x,
            brain.node.worldPosition.y)

        let dist=brain.getDistanceToPlayer(myPos)
        if (dist>brain.losePlayerDistance){
            brain.changeState(brain.lostPlayerState)
            return
        }
        if (dist>this.attackRange){
            if (brain.isMovingSlowly){
                this.stuckTimer+=dt

                if(this.stuckTimer>=this.stuckThresholdTime){
                    brain.changeState(brain.stuckState)
                    return
                }
            }
            else{
                this.stuckTimer=Math.max(0, this.stuckTimer-(dt*2))
            }
        }
        else{
            this.stuckTimer=0
        }

        let dir=brain.compositeIntent.getDesiredVelocity(myPos, brain.getPlayerPos())
        brain.setMoveDirection(dir)
    }
    exit(brain: EnemyInputSystem): void {
        
    }
    
}


