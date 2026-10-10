import { _decorator, Component, math, Node, RigidBody, RigidBody2D, Vec2 } from 'cc';
import { MovementConfig } from './EnemyConfig';
const { ccclass, property } = _decorator;

@ccclass('EnemyMovementSystem')
export class EnemyMovementSystem extends Component {

    private maxSpeed: number | null=null
    private maxTurnForce: number | null=null
    private rigidBody: RigidBody2D | null=null

    protected onLoad(): void {
        this.rigidBody=this.getComponent(RigidBody2D)
    }

    public init(movementConfig: MovementConfig){
        this.maxSpeed=movementConfig.maxSpeed
        this.maxTurnForce=movementConfig.maxTurnForce
    }

    public updateRotation(angleDegrees: number | null){
        if (angleDegrees != null){
            this.node.angle=angleDegrees
        }
        else{
            let currentVelocity=this.getVelocity()
            if (currentVelocity.lengthSqr()> 0.01){
                this.node.angle=math.toDegree(Math.atan2(currentVelocity.y, currentVelocity.x))
            }
        }
    }

    public getVelocity(): Vec2{
        return this.rigidBody ? this.rigidBody.linearVelocity.clone() : Vec2.ZERO
    }
    public updateMovement(moveDir: Vec2){
        if (!this.rigidBody) return

        let currentVelocity=this.getVelocity()

        let desiredVelocity=new Vec2
        Vec2.multiplyScalar(desiredVelocity,moveDir, this.maxSpeed)

        let steeringForce=new Vec2
        Vec2.subtract(steeringForce, desiredVelocity, currentVelocity)
        steeringForce=this.clampForce(steeringForce, this.maxTurnForce)

        currentVelocity.add(steeringForce)

        currentVelocity=this.clampForce(currentVelocity, this.maxSpeed)

        this.rigidBody.linearVelocity=currentVelocity
    }

    private clampForce(force: Vec2, maxForce: number): Vec2{

        if (force.lengthSqr()>(maxForce**2)){
            force.normalize().multiplyScalar(maxForce)
        }
        return force
    }

    public isMovingSlowly(): boolean{
        if (!this.rigidBody) return true
        return this.rigidBody.linearVelocity.lengthSqr()<10
    }

}


