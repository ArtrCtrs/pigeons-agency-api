export interface Pigeon {
    id: number;
    type:number;
    name:string;
    rank: number;
    attack: number;
    attackrandomness:number;
    shield: number;
    defense: number;
    defenserandomness:number;
    energy: number;
    maxenergy:number;
    feedcost:number;
    droppingsminute: number;
    feathers: number;
    creationtime:number;
    element:number;
    attacker:boolean;
    defender:boolean;
    ownerid:number;
}