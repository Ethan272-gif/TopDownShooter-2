import { _decorator, Component, find, input, Node, Vec2 } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';
import { IntentConfig, MovementConfig } from './EnemyConfig';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    public static activeEnemies: Enemy[]=[]

    @property({group: 'Intent Weights', slide: true, range: [0, 5, 0.1]})
    public seekWeight: number=1.0

    @property({group: 'Intent Weights', slide: true, range: [0,5, 0.1]})
    public fleeWeight: number=0.0

    @property({group: 'Movement Weights', slide: true, range:[0, 5, 0.1]})
    public maxSpeed: number=4

    @property({group: 'Movement Weights', slide: true, range: [0, 1, 0.1]})
    public maxTurnForce: number=0.2

    @property({group: 'Movement Weights', slide: true, range: [0, 10, 0.1]})
    public avoidWeight: number=3

    @property({group: 'Movement Weights', slide: true, range: [0, 5, 0.1]})
    public seperationWeight: number=0

    @property({group: 'Movement Weights', slide: true, range: [0, 150, 5]})
    public seperationRadius: number=50

    @property({group: 'Movement Weights', slide: true, range: [0, 5, 0.1]})
    public alignmentWeight: number=0

    @property({group: 'Movement Weights', slide: true, range: [0, 200, 5]})
    public alignmentRadius: number=100

    @property({group: 'Movement Weights', slide: true, range: [0, 5, 0.1]})
    public cohesionWeight: number=0

    @property({group: 'Movement Weights', slide: true, range: [0, 400, 5]})
    public cohesionRadius: number=245

    private inputSystem: EnemyInputSystem | null=null
    private movementSystem: EnemyMovementSystem | null=null
    private healthSystem: HealthSystem | null=null
    private intentConfig: IntentConfig
    private movementConfig: MovementConfig

    private targetNode: Node | null=null

    protected onLoad(): void {

        Enemy.activeEnemies.push(this)

        this.inputSystem=this.getComponent(EnemyInputSystem)
        this.movementSystem=this.getComponent(EnemyMovementSystem)
        this.healthSystem=this.getComponent(HealthSystem)

        if(this.healthSystem) {
            this.healthSystem.initialize(20)
        }
        
        this.intentConfig={
            seekWeight: this.seekWeight,
            fleeWeight: this.fleeWeight
        }

        this.movementConfig={
            maxSpeed: this.maxSpeed,
            maxTurnForce: this.maxTurnForce,
            avoidWeight: this.avoidWeight,
            flocking:{
                seperationWeight: this.seperationWeight,
                seperationRadius: this.seperationRadius,
                alignmentWeight: this.alignmentWeight,
                alignmentRadius: this.alignmentRadius,
                cohesionWeight: this.cohesionWeight,
                cohesionRadius: this.cohesionRadius
            }, 
            whiskers:[
                { startPos: new Vec2, angle: 0, length: 100 },
                { startPos: new Vec2, angle: 25, length: 75 },
                { startPos: new Vec2, angle: -25, length: 75 },
                { startPos: new Vec2, angle: 45, length: 50 },
                { startPos: new Vec2, angle: -45, length: 50 }
                
            ]
        }
        
    }

    start() {
        if (this.inputSystem){
            this.targetNode=find("Canvas/Player")
            let wanderPoints=this.node.getParent().getChildByName("WanderNodes").children.map(
                child=>new Vec2(child.worldPosition.x,child.worldPosition.y)
            )
            this.inputSystem.initialize(this.targetNode, wanderPoints, this.intentConfig)
            
        }

        if (this.movementSystem){
            this.movementSystem.init(this.movementConfig)
        }
    }

    update(deltaTime: number) {
        if (this.healthSystem){
            if (this.healthSystem.isDead){
                this.node.destroy()
            }
        }

        // if(!this.targetNode){
        //     this.targetNode=find("Canvas/Player")
        //     this.inputSystem.initialize(this.targetNode)
        // }

        if (this.inputSystem && this.movementSystem){

            let isSlow=this.movementSystem.isMovingSlowly()
            this.inputSystem.isMovingSlowly=isSlow

            this.inputSystem.processFSM(deltaTime)

            let moveDir=this.inputSystem.getMoveDirection()

            this.movementSystem.updateMovement(moveDir)

            let targetAngle=this.inputSystem.getRotationAngle()
            this.movementSystem.updateRotation(targetAngle)
        }

        if (this.inputSystem.stateDebugLabel){
            this.inputSystem.stateDebugLabel.node.angle= -this.node.angle
        }

    }

    protected onDestroy(): void {
        let index=Enemy.activeEnemies.indexOf(this)
        if(index>-1){
            Enemy.activeEnemies.splice(index, 1)
        }
    }
}


