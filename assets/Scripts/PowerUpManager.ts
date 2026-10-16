import { _decorator, Component, instantiate, log, math, Node, Prefab, Vec3 } from 'cc';
import { PowerUpConfig, PowerUpType } from './PowerUpConfig';
import { EventBus, GameEvents } from './EventBus';
import { Enemy } from './Enemy';
import { PowerUp } from './PowerUp';
const { ccclass, property } = _decorator;

interface PowerUpPayload{
    type: PowerUpType
    extraInfo: number
}

@ccclass('PowerUpManager')
export class PowerUpManager extends Component {
    
    @property({type:[PowerUpConfig], group: 'Power Up Pool'})
    public dropPool: PowerUpConfig[]=[]

    @property({type: Node, group:'Dependencies'})
    public powerUpContainer: Node | null=null

    @property({type: Prefab, group: 'Dependencies'})
    public basePowerUpPrefab: Prefab | null=null

    private dropsRemainingThisWave: number=0
    private enemiesRemainingThisWave: number=0

    protected onLoad(): void {
        EventBus.on(GameEvents.WAVE_SPAWNED, this.setupWaveDrops, this)
        EventBus.on(GameEvents.ENEMY_DIED, this.handleEnemyDrop, this)
        EventBus.on(GameEvents.POWERUP_COLLECTED, this.applyPowerUp, this)
        EventBus.on(GameEvents.WAVE_COUNTDOWN, this.handleCountDown, this)
    }

    protected onDestroy(): void {
        EventBus.off(GameEvents.WAVE_SPAWNED, this.setupWaveDrops, this)
        EventBus.off(GameEvents.ENEMY_DIED, this.handleEnemyDrop, this)
        EventBus.off(GameEvents.POWERUP_COLLECTED, this.applyPowerUp, this)
        EventBus.off(GameEvents.WAVE_COUNTDOWN, this.handleCountDown, this)
    }

    private handleCountDown(countDownText: string){
        if (countDownText==="Go!" && this.powerUpContainer){
            this.powerUpContainer.removeAllChildren()
        }
    }

    private setupWaveDrops(activeEnemies: Enemy[]){
        this.enemiesRemainingThisWave=activeEnemies.length
        this.dropsRemainingThisWave=activeEnemies.length>25 ?
            math.randomRangeInt(2, 3) : math.randomRangeInt(1, 2)

    }

    private handleEnemyDrop(deadEnemy: Enemy){
        this.enemiesRemainingThisWave--
        if(this.dropsRemainingThisWave<=0) return
        let dropChance=this.dropsRemainingThisWave/(this.enemiesRemainingThisWave+1)

        if(Math.random()<=dropChance){
            this.spawnPowerUp(deadEnemy.node.worldPosition)
            this.dropsRemainingThisWave--
        }
    }

    private spawnPowerUp(spawnPosition: Vec3){
        if (this.dropPool.length<=0 || !this.powerUpContainer || !this.basePowerUpPrefab) return

        let totalWeight=this.dropPool.reduce((sum, config)=>sum+config.weight, 0)
        let randomValue=Math.random()*totalWeight
        let currentWeight=0
        let chosenPowerUpConfig: PowerUpConfig | null=null

        for(let currentConfg of this.dropPool){
            currentWeight+=currentConfg.weight
            if(randomValue<=currentWeight){
                chosenPowerUpConfig=currentConfg
                break
            }
        }

        if(chosenPowerUpConfig){
            let powerUpNode=instantiate(this.basePowerUpPrefab)
            powerUpNode.setParent(this.powerUpContainer)
            powerUpNode.setWorldPosition(spawnPosition)

            let powerUpComponent=powerUpNode.getComponent(PowerUp)
            if(powerUpComponent){
                powerUpComponent.init(chosenPowerUpConfig.type,
                    chosenPowerUpConfig.extraInfo, chosenPowerUpConfig.spriteIcon)
            }
        }
    }

    private applyPowerUp(payload: PowerUpPayload){
        switch(payload.type){
            case PowerUpType.HEALTH_HEAL:
                EventBus.emit(GameEvents.HEAL_PLAYER, payload.extraInfo)
                break
            case PowerUpType.WEAPON_SWITCH:
                EventBus.emit(GameEvents.WEAPON_SWAP, payload.extraInfo)
                break
            default:
                log(`[PowerUpManager] Unhandled PowerUpType: ${payload.type}`)

        }
    }

}


