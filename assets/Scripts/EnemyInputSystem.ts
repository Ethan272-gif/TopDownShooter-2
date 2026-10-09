import { _decorator, Component, Label, math, Node, Vec2 } from 'cc';
import { SeekBehavior } from './SeekBehavior';
import { IInputSystem } from './IInputSystem';
import { WanderBehavior } from './WanderBehavior';
import { IState } from './IState';
import { ArrivedState } from './ArrivedState';
import { PatrolState } from './PatrolState';
import { ChaseState } from './ChaseState';
import { LostPlayerState } from './LostPlayerState';
import { FleeBehavior } from './FleeBehavior';
import { StuckState } from './StuckState';
import { IntentSteeringBehavior } from './IntentSteeringBehavior';
import { IntentConfig } from './EnemyConfig';
const { ccclass, property } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem{

    @property({type:Label})
    public stateDebugLabel: Label | null=null

    public seek: SeekBehavior =new SeekBehavior()
    public wander: WanderBehavior = new WanderBehavior()
    public flee: FleeBehavior = new FleeBehavior()
    public compositeIntent: IntentSteeringBehavior= new IntentSteeringBehavior()
    public targetNode: Node | null = null

    public patrolState: PatrolState = new PatrolState()
    public arrivedState: ArrivedState = new ArrivedState()
    public chaseState: ChaseState = new ChaseState()
    public lostPlayerState: LostPlayerState = new LostPlayerState()
    public stuckState: StuckState = new StuckState()

    public spotPlayerDistance: number=200
    public losePlayerDistance: number=250

    private currentState: IState | null=null
    private currentMoveDir: Vec2 = new Vec2

    private _isMovingSlowly: boolean; 
    public get isMovingSlowly(): boolean {
        return this._isMovingSlowly;
    }
    public set isMovingSlowly(value: boolean) {
        this._isMovingSlowly = value;
    }

    public initialize(targetNode: Node,wayPoints: Vec2[], intentConfig: IntentConfig){
        this.targetNode = targetNode
        this.wander.init(wayPoints, intentConfig)
        this.compositeIntent.setWeights(intentConfig)

        this.changeState(this.patrolState)
    }

    public changeState(newState: IState){
        if (this.currentState && this.currentState != newState){
            this.currentState.exit(this)
        }
        if (this.currentState != newState){
            this.currentState=newState
            this.currentState.enter(this)

            if (this.stateDebugLabel){
                this.stateDebugLabel.string=newState.constructor.name
            }
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


