import { math, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";
import { FleeBehavior } from "./FleeBehavior";
import { SeekBehavior } from "./SeekBehavior";
import { IntentConfig } from "./EnemyConfig";
import { PursuitBehavior } from "./PursuitBehavior";

export class IntentSteeringBehavior implements ISeeringBehavior {

    private intent: IntentConfig
    private seekBehavior: SeekBehavior = new SeekBehavior()
    private fleeBehavior: FleeBehavior = new FleeBehavior()
    private puruitBehavior: PursuitBehavior

    public setWeights(steering: IntentConfig){
        this.intent=steering
        this.puruitBehavior=new PursuitBehavior(steering.maxSpeed, steering.maxPredictionTime)
    }

    getDesiredVelocity(currentPosition: math.Vec2, targetPosition?: Readonly<math.Vec2>, targetVelocity?: Readonly<Vec2>): math.Vec2 {
        let totalSteeringForce= new Vec2

        if(!targetPosition) return totalSteeringForce

        if (this.intent.seekWeight>0&&targetPosition){
            let seekForce=this.puruitBehavior.getDesiredVelocity(currentPosition, targetPosition, targetVelocity)
            seekForce.multiplyScalar(this.intent.seekWeight)
            totalSteeringForce.add(seekForce)
        }

        if (this.intent.fleeWeight>0&&targetPosition){
            let fleeForce=this.fleeBehavior.getDesiredVelocity(currentPosition, targetPosition)
            fleeForce.multiplyScalar(this.intent.fleeWeight)
            totalSteeringForce.add(fleeForce)
        }

        if (totalSteeringForce.lengthSqr()>1.0){
            totalSteeringForce.normalize()
        }

        return totalSteeringForce
    }

}


