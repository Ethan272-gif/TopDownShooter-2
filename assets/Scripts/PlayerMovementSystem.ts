import { _decorator, Component, Node, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovementSystem')
export class PlayerMovementSystem extends Component {

    @property
    public speed:number=10

    private rigiBody: RigidBody2D | null=null

    protected onLoad(): void {
        this.rigiBody=this.getComponent(RigidBody2D)
    }

    public updateRotation(angleDegrees: number): void{
        this.node.angle=angleDegrees
    }
    public updateMovement(moveDir:Vec2): void{
        if (!this.rigiBody) return

        let currentVelocity=new Vec2
        Vec2.multiplyScalar(currentVelocity, moveDir, this.speed)

        this.rigiBody.linearVelocity = currentVelocity
    }
}


