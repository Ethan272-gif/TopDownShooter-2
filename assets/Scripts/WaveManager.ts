import { _decorator, Component, log, Node } from 'cc';
import { WaveFactory } from './WaveFactory';
import { Enemy } from './Enemy';
import { EventBus, GameEvents } from './EventBus';
const { ccclass, property } = _decorator;

export enum WaveState{
    INTERMISSION,
    ACTIVE_WAVE,
    PAUSED,
    GAME_OVER
}

@ccclass('WaveManager')
export class WaveManager extends Component {
    
    @property({type: WaveFactory})
    public waveFactory: WaveFactory | null=null

    private activeEnemies: Enemy[]=[]
    private activeEnemyCount: number=0
    private currentWaveIndex: number=0
    private stateStack: WaveState[]=[]
    private countDownSequence: string[]=['5','4','3','Get Ready', 'Go!']

    private get currentState(): WaveState | null{
        if(this.stateStack.length===0) return null
        return this.stateStack[this.stateStack.length-1]
    }

    protected onLoad(): void {
        EventBus.on(GameEvents.ENEMY_DIED, this.handleEnemyDeath, this)

    }
    protected onDestroy(): void{
        EventBus.off(GameEvents.ENEMY_DIED, this.handleEnemyDeath, this)
    
    }

    protected start() {
        this.pushState(WaveState.INTERMISSION)
    }



    private pushState(newState: WaveState){
        if(this.currentState===newState){
            log(`[Wave Manager] Ignored push: ${WaveState[newState]} is already
                active`)
            return
        }
        this.stateStack.push(newState)
        this.executeStateEntry(newState)
    }

    private switchState(newState: WaveState){
        if(this.currentState===newState) return
        this.popState()
        this.pushState(newState)
    }

    private popState(){
        if(this.stateStack.length>0){
            this.stateStack.pop()
        }else{
            log('[Wave Manager] Tried to pop a state from an empty stack')
        }
    }

    private executeStateEntry(state:WaveState){
        switch(state){
            case WaveState.INTERMISSION:
                this.startCountdownLoop()
                break
            case WaveState.ACTIVE_WAVE:
                this.spawnCurrentWave()
                break
            case WaveState.GAME_OVER:
                log('[Move Manager] Game Over state reached')
                break
        }
    }

    private startCountdownLoop(){
        let step=0

        this.schedule(()=>{
            if (step<this.countDownSequence.length){
                EventBus.emit(GameEvents.WAVE_COUNTDOWN, this.countDownSequence[step])
                log(`[Count Down] ${this.countDownSequence[step]}`)
                if (step===this.countDownSequence.length-1){
                    this.switchState(WaveState.ACTIVE_WAVE)
                }
                step++
            }
        }, 1.0, this.countDownSequence.length-1)
    }

    private handleEnemyDeath(deadEnemy: Enemy){
        if(this.currentState!==WaveState.ACTIVE_WAVE) return

        let index=this.activeEnemies.indexOf(deadEnemy)
        if(index> -1){
            this.activeEnemies.splice(index, 1)
        }

        if(this.activeEnemies.length<=0){
            this.currentWaveIndex++
            log(`[Wave Finished] Current Wave: ${this.currentWaveIndex}`)
            EventBus.emit(GameEvents.WAVE_FINISHED)
            this.switchState(WaveState.INTERMISSION)
        }
    }

    private spawnCurrentWave(){
        if(!this.waveFactory){
            log('[Wave Manager] WaveFactory reference is missing')
            return
        }

        this.activeEnemies=this.waveFactory.buildWave(this.currentWaveIndex)
        log(`[Spawn Wave] ${this.activeEnemyCount}`)
        EventBus.emit(GameEvents.WAVE_SPAWNED)
    }

}

