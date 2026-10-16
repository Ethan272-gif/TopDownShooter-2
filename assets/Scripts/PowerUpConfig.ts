import { _decorator, Component, Enum, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export enum PowerUpType{
    HEALTH_HEAL,
    SPEED_BOOST,
    FIRE_RATE_UP,
    WEAPON_SWITCH,
    FIRE_DAMAGE_UP
}

Enum(PowerUpType)

@ccclass('PowerUpConfig')
export class PowerUpConfig {
    @property({type: SpriteFrame})
    public spriteIcon: SpriteFrame | null=null

    @property({type: Enum(PowerUpType)})
    public type: PowerUpType=PowerUpType.HEALTH_HEAL

    @property({tooltip: "Values: Weapon ID(1-4), Heal Amount, Speed Boost duration, etc."})
    public extraInfo: number=0

    @property
    public weight: number=1

    
}

