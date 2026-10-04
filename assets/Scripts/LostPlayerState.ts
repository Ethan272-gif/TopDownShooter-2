import { Vec2 } from "cc";
import { EnemyInputSystem } from "./EnemyInputSystem";
import { IState } from "./IState";



export class LostPlayerState implements IState {

    private timer: number=0
    private waitTime: number=0.5

    enter(brain: EnemyInputSystem): void {
        brain.setMoveDirection(Vec2.ZERO)
        this.timer=this.waitTime
    }
    execute(brain: EnemyInputSystem, dt: number): void {
        this.timer -= dt
        let myPos = new Vec2(brain.node.worldPosition.x, brain.node.worldPosition.y)

        if (brain.getDistanceToPlayer(myPos)<brain.spotPlayerDistance){
            brain.changeState(brain.chaseState)
            return
        }

        if (this.timer <= 0){
            brain.changeState(brain.patrolState)
        }
    }
    exit(brain: EnemyInputSystem): void {
        
    }
    
}


