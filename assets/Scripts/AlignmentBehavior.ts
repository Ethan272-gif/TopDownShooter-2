import { math, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";
import { EnemyMovementSystem } from "./EnemyMovementSystem";

export class AlignmentBehavior implements ISeeringBehavior {

    private brain: EnemyMovementSystem
    private alignmentRadius: number

    constructor(enemyMovementSystem: EnemyMovementSystem, alignmentRadius: number){
        this.brain=enemyMovementSystem
        this.alignmentRadius=alignmentRadius
    }

    getDesiredVelocity(currentPosition: math.Vec2, targetPosition?: Readonly<math.Vec2>): math.Vec2 {
        let neighbors=this.brain.getNeighborData()
        let alignmentForce = new Vec2

        if(neighbors.length === 0) return alignmentForce

        let averageVelocity = new Vec2
        let neighborCount = 0

        for(let neighbor of neighbors){
            let distance = Vec2.distance(currentPosition, neighbor.position)

            if(distance < this.alignmentRadius){
                averageVelocity.add(neighbor.velocity)
                neighborCount++
            }
        }

        if(neighborCount === 0) return alignmentForce

        averageVelocity.multiplyScalar(1.0 / neighborCount)

        if(averageVelocity.lengthSqr()>0){
            averageVelocity.normalize()
            alignmentForce=averageVelocity
        }

        return alignmentForce
    }
    
}


