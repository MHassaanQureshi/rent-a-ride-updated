export interface Iuser {
    _id:String;
    name:string;
    email:string;
    contact:number;
    password:string;
    address:string;

}
export interface Ivehicle{
     _id:string;
    name : string,
    model : string,
    fuel_type:string,
    color: string,
    description: string,
    price : string,
    image:string[],
    fromavailabilityDate : string,
    toavailabilityDate :string,
    provider_id:string,
    Vehicletype:string,


}

export interface Ibooking{
    car_id:number;
    start_date:Date;
    end_date:Date;
    total_price:number;
    status:[];
    


}
// export interface Iprovider{
//     name:string;
//     id:number;
//     email:string;
//     no_of_cars:number;
//     successful_order:number;
//     cars:[]


// }

export interface CarType{
    id: number,
    name: string,
    type: string,
    fuel_capacity: string,
    transmission: string,
    seating_capacity: string,
    price_per_day: string,
    image_url:string,
    tags:string,
}