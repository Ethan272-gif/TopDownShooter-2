import { Vec2 } from "cc";
import { EnemyInputSystem } from "./EnemyInputSystem";
import { IState } from "./IState";

export class ArrivedState implements IState {

    private waitTime: number=2.0
    private timer: number=0

    enter(brain: EnemyInputSystem): void {
        brain.setMoveDirection(Vec2.ZERO)
        this.timer=this.waitTime
    }
    execute(brain: EnemyInputSystem, dt: number): void {
        this.timer -= dt
        let myPos=new Vec2(brain.node.worldPosition.x,brain.node.worldPosition.y)
        // if (brain.getDistanceToPlayer(myPos)<brain.spotPlayerDistance){
        //     brain.changeState(brain.changeState)
        //     return
        // }

        if (this.timer<=0){
            // brain.wander.pickNewWanderPoint()
            brain.changeState(brain.patrolState)
        }
    }
    exit(brain: EnemyInputSystem): void {
        
    }
    
}


