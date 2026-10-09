import { Vec2 } from "cc";
import { EnemyInputSystem } from "./EnemyInputSystem";
import { IState } from "./IState";

export class StuckState implements IState {

    private fleeTimer: number=0
    private fleeDuration: number=1.0

    private escapePoint: Vec2=new Vec2

    enter(brain: EnemyInputSystem): void {
        this.fleeTimer=this.fleeDuration

        let myPos=new Vec2(brain.node.worldPosition.x, brain.node.worldPosition.y)

        let intendedDir=brain.getMoveDirection()

        let randomNoise=new Vec2(Math.random()-0.5, Math.random()-0.5).normalize()

        this.escapePoint=new Vec2(
            myPos.x+intendedDir.x+randomNoise.x,
            myPos.y+intendedDir.y+randomNoise.y
        )
    }
    execute(brain: EnemyInputSystem, dt: number): void {
        this.fleeTimer-=dt

        if (this.fleeTimer<=0){
            brain.changeState(brain.patrolState)
            return
        }

        let myPos=new Vec2(brain.node.worldPosition.x, brain.node.worldPosition.y)

        let dir= brain.flee.getDesiredVelocity(myPos, this.escapePoint)
        brain.setMoveDirection(dir)
    }
    exit(brain: EnemyInputSystem): void {
        
    }
    
}


