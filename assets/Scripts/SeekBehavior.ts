import { Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";

export class SeekBehavior implements ISeeringBehavior{
    getDesiredVelocity(currentPosition: Vec2, targetPosition?: Readonly<Vec2>): Vec2 {
        let desiredDir= new Vec2
        Vec2.subtract(desiredDir, targetPosition, currentPosition)
        return desiredDir.normalize()
    }
}