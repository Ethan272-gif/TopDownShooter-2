import { math, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";
import { SeekBehavior } from "./SeekBehavior";

export class PursuitBehavior implements ISeeringBehavior {

    private seekBehavior: SeekBehavior = new SeekBehavior()
    private pursuerSpeed: number
    private maxPredictionTime: number

    constructor(pursuerSpeed: number, maxPredictionTime: number){
        this.pursuerSpeed = pursuerSpeed
        this.maxPredictionTime = maxPredictionTime
    }

    getDesiredVelocity(currentPosition: math.Vec2, targetPosition?: Readonly<math.Vec2>, targetVelocity?: Readonly<math.Vec2>): math.Vec2 {
        if(!targetPosition) return Vec2.ZERO

        if(!targetVelocity || targetVelocity.lengthSqr() === 0){
            return this.seekBehavior.getDesiredVelocity(currentPosition, targetPosition)
        }

        let distance = Vec2.distance(currentPosition, targetPosition)

        let predictionTime = distance / this.pursuerSpeed

        if(predictionTime > this.maxPredictionTime){
            predictionTime = this.maxPredictionTime
        }

        let predictionPosition = new Vec2
        let futureTravel = targetVelocity.clone().multiplyScalar(predictionTime)
        Vec2.add(predictionPosition, targetPosition, futureTravel)

        return this.seekBehavior.getDesiredVelocity(currentPosition, predictionPosition)
    }
    
}


