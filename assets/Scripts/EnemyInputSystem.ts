import { _decorator, Component, math, Node, Vec2 } from 'cc';
import { SeekBehavior } from './SeekBehavior';
import { IInputSystem } from './IInputSystem';
import { WanderBehavior } from './WanderBehavior';
import { IState } from './IState';
import { ArrivedState } from './ArrivedState';
import { PatrolState } from './PatrolState';
const { ccclass, property } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem{


    // private seek: SeekBehavior=new SeekBehavior()
    public wander: WanderBehavior= new WanderBehavior()
    // private targetNode: Node | null = null

    public patrolState: PatrolState=new PatrolState()
    public arrivedState: ArrivedState=new ArrivedState()

    private currentState: IState | null=null
    private currentMoveDir: Vec2=new Vec2

    public initialize(wayPoints: Vec2[]){
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
}


