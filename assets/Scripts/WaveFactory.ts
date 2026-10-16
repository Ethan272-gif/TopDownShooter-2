import { _decorator, Component, find, instantiate, JsonAsset, log, Node, Prefab, UITransform, Vec2 } from 'cc';
import { Enemy } from './Enemy';
import { EnemyConfig } from './EnemyConfig';
const { ccclass, property } = _decorator;

@ccclass('WaveFactory')
export class WaveFactory extends Component {

    @property({type: Node, group: 'Spawning Setup'})
    public enemyContainer: Node | null=null

    @property({type: Node, group: 'Spawning Setup'})
    public targetNode: Node | null=null

    @property({type: [Node], group: 'Spawning Setup'})
    public wanderNodes:Node[]=[]

    @property({type: [Prefab], group:'Normal Wave'})
    public enemyPrefabs: Prefab[]=[]

    @property({type:[JsonAsset], group: 'Normal Wave'})
    public waveConfigs: JsonAsset[]=[]


    @property({type:[Prefab], group:'Boss Wave'})
    public bossPrefabs: Prefab[]=[]

    @property({type: JsonAsset, group: 'Boss Wave'})
    public bossConfig: JsonAsset | null=null

    private spawnRadius: number=0

    protected onLoad(): void {
        let canvasNode=find('Canvas')
        let uiTransform=canvasNode.getComponent(UITransform)
        if(uiTransform){
            this.spawnRadius=Math.max(uiTransform.contentSize.width, uiTransform.contentSize.height)
        }
        else{
            this.spawnRadius=960
        }

    }

    public buildWave(waveIndex: number, isBossStage?: boolean): Enemy[] {
        if(!this.enemyPrefabs || !this.enemyContainer || !this.targetNode ||
            this.waveConfigs.length===0 || !this.wanderNodes){
                log('[WaveFactory] Missing dependencies in the inspector')
                return []
            }
            let bossStage=isBossStage!=null ? isBossStage : false
            let spawnCount=Math.min(2+(waveIndex*4), 50)
            let config=this.determineEnemyConfig(waveIndex, bossStage)
            let prefab=this.determinePrefab(waveIndex, bossStage)
            let wanderPoints=this.wanderNodes.map(node=>
                new Vec2(node.worldPosition.x, node.worldPosition.y))

            return this.generateRadialWave(prefab, this.enemyContainer,
                spawnCount, this.spawnRadius,
                config, this.targetNode, wanderPoints)

    }

    private determineEnemyConfig(waveIndex: number, bossStage: boolean): EnemyConfig{
        if(this.waveConfigs.length===0){
            log('[Wave Factory] No standard wave configs available')
            return null
        }

        if(bossStage && this.bossConfig){
            return this.bossConfig.json as unknown as EnemyConfig
        }

        let standardIndex=waveIndex % this.waveConfigs.length
        log(`[WaveFactory] index: ${standardIndex} Config files: ${this.waveConfigs.length}`)
        return this.waveConfigs[standardIndex].json as unknown as EnemyConfig
    }

    private determinePrefab(waveIndex: number, bossStage: boolean): Prefab{
        if(bossStage && this.bossPrefabs.length!==0){
            let index=waveIndex%this.bossPrefabs.length
            return this.bossPrefabs[index]
        }

        let index=waveIndex % this.enemyPrefabs.length
        return this.enemyPrefabs[index]
    }

    private generateRadialWave(enemyPrefabs:Prefab, container: Node, enemyCount: number,
        spawnRadius: number, config: EnemyConfig, target: Node, wanderPoints: Vec2[]): Enemy[]{
            let spawnEnemies=[]
            let angleStep=(Math.PI*2)/enemyCount

            for(let i=0; i<enemyCount; i++){
                let currentAngle=i*angleStep
                let spawnX=Math.cos(currentAngle)*spawnRadius
                let spawnY=Math.sin(currentAngle)*spawnRadius

                let enemyNode=instantiate(enemyPrefabs)
                enemyNode.setParent(container)
                enemyNode.setPosition(spawnX, spawnY)

                let masterEnemyComp=enemyNode.getComponent(Enemy)
                if(masterEnemyComp){
                    masterEnemyComp.init(config, target, wanderPoints)
                    spawnEnemies.push(masterEnemyComp)
                }

            }
            return spawnEnemies
        }
}


