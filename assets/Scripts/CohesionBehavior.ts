import { math, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";
import { EnemyMovementSystem } from "./EnemyMovementSystem";

export class CohesionBehavior implements ISeeringBehavior {

    private brain: EnemyMovementSystem
    private cohesionRadius: number

    constructor(enemyMovementSystem: EnemyMovementSystem, cohesionRadius: number){
        this.brain=enemyMovementSystem
        this.cohesionRadius=cohesionRadius
    }

    getDesiredVelocity(currentPosition: math.Vec2, targetPosition?: Readonly<math.Vec2>): math.Vec2 {
        let neighbors = this.brain.getNeighborData()
        let cohesionForce = new Vec2

        if(neighbors.length <= 0) return cohesionForce

        let centerOfMass = new Vec2
        let neighborCount = 0

        for(let neighbor of neighbors){
            let distance = Vec2.distance(currentPosition, neighbor.position)

            if(distance < this.cohesionRadius){
                centerOfMass.add(neighbor.position)
                neighborCount++
            }
        }

        if(neighborCount === 0) return cohesionForce

        centerOfMass.multiplyScalar(1.0 / neighborCount)
        Vec2.subtract(cohesionForce, centerOfMass, currentPosition)

        let distanceToCenter = cohesionForce.length()
        cohesionForce.normalize()

        let strength = Math.min(distanceToCenter / this.cohesionRadius, 1.0)
        cohesionForce.multiplyScalar(strength)

        return cohesionForce
    }
    
}


