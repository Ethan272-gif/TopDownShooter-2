import { Vec2 } from "cc";
import { EnemyInputSystem } from "./EnemyInputSystem";
import { IState } from "./IState";

export class ChaseState implements IState {
    enter(brain: EnemyInputSystem): void {
        
    }
    execute(brain: EnemyInputSystem, dt: number): void {
        
        if(!brain.targetNode) return

        let myPos=new Vec2(brain.node.worldPosition.x,
            brain.node.worldPosition.y)

        if (brain.getDistanceToPlayer(myPos)>brain.losePlayerDistance){
            brain.changeState(brain.patrolState)
            return
        }

        let dir=brain.seek.getDesiredVelocity(myPos, brain.getPlayerPos())
        brain.setMoveDirection(dir)
    }
    exit(brain: EnemyInputSystem): void {
        
    }
    
}


