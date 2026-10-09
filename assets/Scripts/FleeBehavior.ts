import { math, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";

export class FleeBehavior implements ISeeringBehavior {

    getDesiredVelocity(currentPosition: math.Vec2, targetPosition?: Readonly<math.Vec2>): math.Vec2 {
        let desiredDir=new Vec2

        if (!targetPosition) return Vec2.ZERO

        Vec2.subtract(desiredDir, currentPosition, targetPosition)
        return desiredDir.normalize()
    }
   
}


