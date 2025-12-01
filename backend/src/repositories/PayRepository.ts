import { DataSource, EntityTarget } from "typeorm";
import { Pay } from "../Models/pay.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { User } from "../Models/user.entity";
import { Order } from "../Models/order.entity";

export class PayRepository extends TypeORMRepository <Pay, number>{
    constructor(datasource: DataSource){
        super(Pay, datasource)
    }

    async findByDate (payDate: Date): Promise <Pay[]>{
        return await this.repo.findBy({ payDate})
    }

    async findByUser (user: User): Promise<Pay[]>{
        return await this.repo.findBy({ user})
    }

    async findByOrder (order: Order): Promise<Pay[]>{
        return await this.repo.findBy({ order})
    }
}