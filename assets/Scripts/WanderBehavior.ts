import { math, Vec2 } from "cc";
import { ISeeringBehavior } from "./ISteeringBehavior";
import { SeekBehavior } from "./SeekBehavior";

export class WanderBehavior implements ISeeringBehavior {

    private wayPoints: Vec2[]=[]
    private curremtWayPointIndex: number=0
    private wayPointThreshold: number=10

    private seekBehavior: SeekBehavior= new SeekBehavior()

    public setWayPoints(points: Vec2[]){
        this.wayPoints=points
        this.pickNewWanderPoint()
    }

    public pickNewWanderPoint(){
        if (this.wayPoints.length<=0) return 0
        this.curremtWayPointIndex=math.randomRangeInt(0, this.wayPoints.length)
    
    }

    public hasArrived(currentPos: Vec2): boolean{
        if (this.wayPoints.length<=0) return

        let currentTarget=this.wayPoints[this.curremtWayPointIndex]
        return Vec2.distance(currentPos, currentTarget)<=this.wayPointThreshold
    }
    
    getDesiredVelocity(currentPosition: Vec2): Vec2 {
        if(this.wayPoints.length===0) return Vec2.ZERO

        let currentTarget=this.wayPoints[this.curremtWayPointIndex]
        return this.seekBehavior.getDesiredVelocity(currentPosition, currentTarget)
    }

}


