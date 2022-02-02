export class User{
    _id:string;
    name:string;
    surname:string;
    username:string;
    password:string;
    type:string;
    city:string;
    birthday:Date;
    email:string;
    phone:string;
    agency:string;
    licence:number;
    favorites:Array<string>;
    approved:number;
    picture:string;
}