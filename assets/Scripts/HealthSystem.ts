import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HealthSystem')
export class HealthSystem extends Component {

    private maxHealth: number
    private currentHealth: number
    private _isDead: boolean;
    public get isDead(): boolean{
        return this._isDead;
    }

    public initialize(maxHealth: number){
        this.maxHealth=maxHealth
        this.currentHealth=maxHealth
        this._isDead=false
    }

    public takeDamage(amount:number){
        if (this._isDead) return

        this.currentHealth-=amount

        if (this.currentHealth<=0){
            this.currentHealth=0
            this._isDead=true
        }
    }
}


