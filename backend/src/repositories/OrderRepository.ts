import { DataSource, EntityTarget  } from "typeorm";
import { Order } from "../Models/order.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { User } from "../Models/user.entity";

export class OrderRepository extends TypeORMRepository <Order, number>{
    constructor(datasource: DataSource){
        super(Order, datasource)
    }

    async findByDate(orderDate: Date): Promise<Order | null>{
        return await this.repo.findOneBy({ orderDate})
    }

    async findByUser(user: User): Promise<Order[]>{
        return await this.repo.findBy({ user})
    }
}