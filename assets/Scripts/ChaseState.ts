import { Vec2 } from "cc";
import { EnemyInputSystem } from "./EnemyInputSystem";
import { IState } from "./IState";

export class ChaseState implements IState {

    private stuckTimer: number=0
    private stuckThresholdTime: number=1

    enter(brain: EnemyInputSystem): void {
        this.stuckTimer=0
        
    }
    execute(brain: EnemyInputSystem, dt: number): void {
        
        if(!brain.targetNode) return

        let myPos=new Vec2(brain.node.worldPosition.x,
            brain.node.worldPosition.y)

        if (brain.getDistanceToPlayer(myPos)>brain.losePlayerDistance){
            brain.changeState(brain.lostPlayerState)
            return
        }

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

        let dir=brain.seek.getDesiredVelocity(myPos, brain.getPlayerPos())
        brain.setMoveDirection(dir)
    }
    exit(brain: EnemyInputSystem): void {
        
    }
    
}


