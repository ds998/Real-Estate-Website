export class Real_Estate{
    _id: string;
    name:string;
    microlocation:string;
    street:string;
    area:number;
    lines:Array<number>;
    type:string;
    rooms:number;
    construction_year:number;
    state:string;
    heating:string;
    floor:number;
    total_floors:number;
    parking:string;
    monthly_utilities:number;
    price:number;
    about:string;
    characteristics:Array<string>;
    advertiser:{type:string,PIB:string,username:string};
    pictures:Array<string>;
    selling_month:number;
    change_time:Date;
}