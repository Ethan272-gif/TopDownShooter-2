import { math, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";
import { AvoidBehavior } from "./AvoidBehavior";
import { EnemyMovementSystem } from "./EnemyMovementSystem";
import { MovementConfig } from "./EnemyConfig";
import { SeperationBehavior } from "./SeperationBehavior";

export class TacticalSteeringBehavior implements ISeeringBehavior {

    private movementConfig: MovementConfig
    private currentHitNormals: Vec2[]=[]
    private brain: EnemyMovementSystem
    private avoidBehavior: AvoidBehavior
    private separationBehavior: SeperationBehavior

    constructor(movementConfig: MovementConfig, EnemyMovementSystem: EnemyMovementSystem){
        this.movementConfig=movementConfig
        this.brain=EnemyMovementSystem
        this.avoidBehavior=new AvoidBehavior(EnemyMovementSystem, movementConfig.whiskers)
        this.separationBehavior=new SeperationBehavior(EnemyMovementSystem, movementConfig.flocking.seperationRadius)
    }
    getDesiredVelocity(currentPosition: math.Vec2, targetPosition?: Readonly<math.Vec2>): math.Vec2 {
        
        let totalTacticalForce=new Vec2

        if (this.movementConfig.avoidWeight>0){
            let avoidForce=this.avoidBehavior.getDesiredVelocity(currentPosition)
            
            avoidForce.multiplyScalar(this.movementConfig.avoidWeight)
            totalTacticalForce.add(avoidForce)
        }

        if(this.movementConfig.flocking.seperationWeight>0){
            let separationForce=this.separationBehavior.getDesiredVelocity(currentPosition)
            separationForce.multiplyScalar(this.movementConfig.flocking.seperationWeight)
            totalTacticalForce.add(separationForce)
        }

        if(this.movementConfig.flocking.alignmentWeight>0){

        }

        if(this.movementConfig.flocking.cohesionWeight>0){

        }

        if(totalTacticalForce.lengthSqr()>1.0){
            totalTacticalForce.normalize()
        }

        return totalTacticalForce
    }
    
}


