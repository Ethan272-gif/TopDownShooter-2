import { Vec2 } from "cc";

export interface ISeeringBehavior{
    getDesiredVelocity(currentPosition: Vec2, targetPosition?: Readonly<Vec2>):Vec2
}