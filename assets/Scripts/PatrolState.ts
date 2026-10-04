import { Vec2 } from "cc";
import { EnemyInputSystem } from "./EnemyInputSystem";
import { IState } from "./IState";

export class PatrolState implements IState {

    enter(brain: EnemyInputSystem): void {
        
    }
    execute(brain: EnemyInputSystem, dt: number): void {
        
        let myPos = new Vec2(brain.node.worldPosition.x, brain.node.worldPosition.y)

        if (brain.getDistanceToPlayer(myPos)<brain.spotPlayerDistance){
            brain.changeState(brain.chaseState)
            return
        }
        
        
        if (brain.wander.hasArrived(myPos)){
            brain.wander.pickNewWanderPoint()
            brain.changeState(brain.arrivedState)
            return
        }

        let dir = brain.wander.getDesiredVelocity(myPos)
        brain.setMoveDirection(dir)

    }
    exit(brain: EnemyInputSystem): void {
        
    }
    
}


