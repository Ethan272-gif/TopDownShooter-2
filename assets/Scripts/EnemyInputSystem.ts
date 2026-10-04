import { _decorator, Component, math, Node, Vec2 } from 'cc';
import { SeekBehavior } from './SeekBehavior';
import { IInputSystem } from './IInputSystem';
const { ccclass, property } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem{

    private seek: SeekBehavior=new SeekBehavior()
    private targetNode: Node | null = null

    public initialize(targetNode: Node){
        this.targetNode=targetNode
    }

    public getMoveDirection(): Vec2{

        if (!this.targetNode) return Vec2.ZERO

        let currentPos=new Vec2(
            this.node.worldPosition.x, this.node.worldPosition.y)
        let targetPos=new Vec2(
            this.targetNode.worldPosition.x, this.targetNode.worldPosition.y)

        return this.seek.getDesiredVelocity(currentPos, targetPos)
    }

    public getRotationAngle(): number {
        return null
    }
}


