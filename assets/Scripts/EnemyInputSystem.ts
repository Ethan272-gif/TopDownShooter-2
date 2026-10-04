import { _decorator, Component, math, Node, Vec2 } from 'cc';
import { SeekBehavior } from './SeekBehavior';
import { IInputSystem } from './IInputSystem';
import { WanderBehavior } from './WanderBehavior';
import { IState } from './IState';
import { ArrivedState } from './ArrivedState';
import { PatrolState } from './PatrolState';
import { ChaseState } from './ChaseState';
import { LostPlayerState } from './LostPlayerState';
const { ccclass, property } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem{


    public seek: SeekBehavior=new SeekBehavior()
    public wander: WanderBehavior= new WanderBehavior()
    public targetNode: Node | null = null

    public patrolState: PatrolState=new PatrolState()
    public arrivedState: ArrivedState=new ArrivedState()
    public chaseState: ChaseState= new ChaseState()
    public lostPlayerState: LostPlayerState=new LostPlayerState()

    public spotPlayerDistance: number=200
    public losePlayerDistance: number=250

    private currentState: IState | null=null
    private currentMoveDir: Vec2=new Vec2

    public initialize(targetNode: Node,wayPoints: Vec2[]){
        this.targetNode = targetNode
        this.wander.setWayPoints(wayPoints)

        this.changeState(this.patrolState)
    }

    public changeState(newState: IState){
        if (this.currentState && this.currentState != newState){
            this.currentState.exit(this)
        }
        if (this.currentState != newState){
            this.currentState=newState
            this.currentState.enter(this)
        }
    }

    public processFSM(dt: number){
        if (this.currentState){
            this.currentState.execute(this, dt)
        }
    }

    public setMoveDirection(dir: Vec2){
        this.currentMoveDir=dir
    }

    public getMoveDirection(): Vec2{ 
        return this.currentMoveDir
    }

    public getRotationAngle(): number {
        return null
    }

    public getDistanceToPlayer(myPos: Vec2): number{
        if (!this.targetNode) return Infinity

        let playerPos=this.getPlayerPos()
        return Vec2.distance(myPos, playerPos)
    }

    public getPlayerPos(): Vec2{
        return new Vec2(
            this.targetNode.worldPosition.x,this.targetNode.worldPosition.y)
    }
}


