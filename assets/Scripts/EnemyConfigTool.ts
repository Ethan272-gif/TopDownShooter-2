import { _decorator, CCFloat, Component, director, math, Node, Vec2 } from 'cc';
import { EnemyConfig, WhiskerConfig } from './EnemyConfig';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('WhiskerConfigEditor')
export class WhiskerConfigEditor implements WhiskerConfig{
    @property
    startPos: Vec2=new Vec2

    @property({type: CCFloat})
    angle: number=0

    @property({type: CCFloat})
    length: number=50

}

@ccclass('EnemyConfigTool')
export class EnemyConfigTool extends Component {
    @property({group:'Enemy base'})
    public scale: Vec2=new Vec2(1,1)

    @property({group:'Enemy base', slide: true, range: [0, 100, 1]})
    public health: number=20
    
    @property({group: 'Intent Weights', slide: true, range: [0, 5, 0.1]})
    public seekWeight: number=1.0

    @property({group: 'Intent Weights', slide: true, range: [0, 5, 0.1]})
    public fleeWeight: number=0.0

    @property({group: 'Intent Weights', slide: true, range: [0, 5, 0.1]})
    public maxPredictionTime: number=2.0

    @property({group: 'Intent Weights', slide: true, range: [0, 5, 0.1]})
    public maxSpeed: number=4

    @property({group: 'Intent Weights', slide: true, range: [0, 500, 10]})
    public spotPlayerDistance: number=200

    @property({group: 'Intent Weights', slide: true, range: [0, 500, 10]})
    public lostPlayerDistance: number=250

    @property({group: 'Movement Weights', slide: true, range: [0, 1, 0.1]})
    public maxTurnForce: number=0.2

    @property({group: 'Movement Weights', slide: true, range: [0, 10, 0.1]})
    public avoidWeight: number=3

    @property({group: 'Movement Weights', slide: true, range: [0, 5, 0.1]})
    public seperationWeight: number=1

    @property({group: 'Movement Weights', slide: true, range: [0, 150, 5]})
    public seperationRadius: number=50

    @property({group: 'Movement Weights', slide: true, range: [0, 5, 0.1]})
    public alignmentWeight: number=1

    @property({group: 'Movement Weights', slide: true, range: [0, 200, 5]})
    public alignmentRadius: number=100

    @property({group: 'Movement Weights', slide: true, range: [0, 5, 0.1]})
    public cohesionWeight: number=1

    @property({group: 'Movement Weights', slide: true, range: [0, 400, 5]})
    public cohesionRadius: number=245

    @property({type:[WhiskerConfigEditor], group:'Whiskers Config'})
    public whiskers: WhiskerConfigEditor[]=[
        (()=>{
            let w=new WhiskerConfigEditor();
            w.startPos=new Vec2(0,0)
            w.angle=0
            w.length=100;
            return w
        })(),
        (()=>{
            let w = new WhiskerConfigEditor();
            w.startPos=new Vec2(0,0)
            w.angle=25
            w.length=75;
            return w
        })(),
        (()=>{
            let w=new WhiskerConfigEditor();
            w.startPos=new Vec2(0,0)
            w.angle=-25
            w.length=75;
            return w
        })(),
        (()=>{
            let w=new WhiskerConfigEditor();
            w.startPos=new Vec2(0,0)
            w.angle=45
            w.length=50;
            return w
        })(),
        (()=>{
            let w=new WhiskerConfigEditor();
            w.startPos=new Vec2(0,0)
            w.angle=-45
            w.length=50;
            return w
        })(),
    ]
    
    private enemyConfig: EnemyConfig

    protected onLoad() {
        this.enemyConfig={
            scale: this.scale,
            health: this.health,
            intent:{
                seekWeight: this.seekWeight,
                fleeWeight: this.fleeWeight,
                maxSpeed: this.maxSpeed,
                maxPredictionTime: this.maxPredictionTime,
                spotPlayerDistance: this.spotPlayerDistance,
                lostPlayerDistance: this.lostPlayerDistance
            },
            moving:{
                maxTurnForce: this.maxTurnForce,
                avoidWeight:this.avoidWeight,
                flocking:{
                    seperationWeight:this.seperationWeight,
                    seperationRadius:this.seperationRadius,
                    alignmentWeight:this.alignmentWeight,
                    alignmentRadius:this.alignmentRadius,
                    cohesionWeight:this.cohesionWeight,
                    cohesionRadius:this.cohesionRadius
                },
                whiskers:this.whiskers
            }

        }

        let scene=director.getScene()
        if (scene){
            let allEnemies=scene.getComponentsInChildren(Enemy)

            for(let enemy of allEnemies){
                enemy.init(this.enemyConfig)
            }
        }


    }
}


