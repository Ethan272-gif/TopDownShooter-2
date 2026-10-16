import { _decorator, Component, Graphics, isValid, math, Node, RigidBody, RigidBody2D, Vec2 } from 'cc';
import { MovementConfig } from './EnemyConfig';
import { TacticalSteeringBehavior } from './TacticalSteeringBehavior';
import { Enemy } from './Enemy';
import { EventBus, GameEvents } from './EventBus';
const { ccclass, property } = _decorator;

export interface NeighborData{
    position: Vec2
    velocity: Vec2
}

@ccclass('EnemyMovementSystem')
export class EnemyMovementSystem extends Component {

    @property({type: Graphics})
    public debugGraphics: Graphics | null=null

    private maxSpeed: number | null=null
    private maxTurnForce: number | null=null
    private teacticalSteering: TacticalSteeringBehavior
    private rigidBody: RigidBody2D | null=null
    private sharedActiveEnemies: Enemy[]=[]

    protected onLoad(): void {
        this.rigidBody=this.getComponent(RigidBody2D)
        EventBus.on(GameEvents.WAVE_SPAWNED, this.reciveEnemyArray, this)
    }

    public init(maxSpeed: number, movementConfig: MovementConfig){
        this.maxSpeed=maxSpeed
        this.maxTurnForce=movementConfig.maxTurnForce
        this.teacticalSteering=new TacticalSteeringBehavior(movementConfig, this)
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

        let currentPosition=new Vec2(this.node.worldPosition.x, this.node.worldPosition.y)

        let tacticalAdjustments=this.teacticalSteering.getDesiredVelocity(currentPosition)

        let combinedForces=new Vec2
        Vec2.add(combinedForces, tacticalAdjustments, moveDir)

        if (combinedForces.lengthSqr()>1.0){
            combinedForces.normalize()
        }

        let desiredVelocity=new Vec2
        Vec2.multiplyScalar(desiredVelocity, combinedForces, this.maxSpeed)

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

    private reciveEnemyArray(masterArray: Enemy[]){
        this.sharedActiveEnemies=masterArray
    }


    public getNeighborData(): NeighborData[] {
        let neighbors: NeighborData[]=[]

        if(!this.sharedActiveEnemies || this.sharedActiveEnemies.length===0) return neighbors

        for (let otherEnemy of this.sharedActiveEnemies){

            if (!isValid(otherEnemy) || !otherEnemy.node || otherEnemy.node === this.node) continue

            let otherMovement=otherEnemy.getComponent(EnemyMovementSystem)
            if(!otherMovement) continue


            neighbors.push({
                position: new Vec2(
                    otherEnemy.node.worldPosition.x,
                    otherEnemy.node.worldPosition.y
                ),
                velocity: otherMovement.getVelocity()
            })
        }

        return neighbors
    }

    protected onDestroy(): void {
        EventBus.off(GameEvents.WAVE_SPAWNED, this.reciveEnemyArray, this)
    }
    
}

