import { ERaycast2DType, math, PhysicsSystem2D, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";
import { EnemyMovementSystem } from "./EnemyMovementSystem";
import { WhiskerConfig } from "./EnemyConfig";

export class AvoidBehavior implements ISeeringBehavior {

    private brain: EnemyMovementSystem
    private whiskers: WhiskerConfig[] | null=null
    private currentHitNormals: Vec2[]=[]

    constructor(enemyMovementSystem: EnemyMovementSystem, whiskers: WhiskerConfig[]){
        this.brain=enemyMovementSystem
        this.whiskers=whiskers
    }

    getDesiredVelocity(currentPosition: math.Vec2, targetPosition?: Readonly<math.Vec2>): math.Vec2 {
        
        this.updateWhiskers()
        let avoidForce=new Vec2
        if(this.currentHitNormals.length<=0) return avoidForce
        for (let normal of this.currentHitNormals){
            avoidForce.add(normal)
        }
        return avoidForce
    }

    public updateWhiskers(){
        this.currentHitNormals=[]
        if (this.brain.debugGraphics) this.brain.debugGraphics.clear()
        let myWorldPos=new Vec2(this.brain.node.worldPosition.x, this.brain.node.worldPosition.y)
        let myAngle=this.brain.node.angle

        for (let whiskers of this.whiskers){
            let localStart=whiskers.startPos
            let localEnd=this.getEndPoint(localStart, whiskers.angle, whiskers.length)

            let worldStart=myWorldPos.clone()
            let worldAngle=myAngle+whiskers.angle
            let worldEnd=this.getEndPoint(worldStart, worldAngle, whiskers.length)

            let results=PhysicsSystem2D.instance.raycast(worldStart, worldEnd, ERaycast2DType.Closest)
            if (results.length>0){
                let hit=results[0]

                let strength=1.0-hit.fraction
                
                let pushForce=hit.normal.clone().multiplyScalar(strength)

                this.currentHitNormals.push(pushForce)

                let localHit=new Vec2
                Vec2.lerp(localHit,localStart,localEnd, hit.fraction)

                this.drawDebugRay(localStart, localHit, true)
            }
            else{
                this.drawDebugRay(localStart, localEnd, false)
            }
        }


    }
    
    private getEndPoint(startPos: Vec2, angle: number, length: number): Vec2{
        let radianAngle=math.toRadian(angle)

        let endX = startPos.x + (length*Math.cos(radianAngle))
        let endY = startPos.y + (length*Math.sin(radianAngle))

        return new Vec2(endX, endY)
    }

    private drawDebugRay(start: Vec2, end: Vec2, hit: boolean){
        if(!this.brain.debugGraphics) return

        this.brain.debugGraphics.strokeColor=hit ? math.Color.RED : math.Color.GREEN
        this.brain.debugGraphics.lineWidth=2
        this.brain.debugGraphics.moveTo(start.x,start.y)
        this.brain.debugGraphics.lineTo(end.x,end.y)
        this.brain.debugGraphics.stroke()
    }

}


