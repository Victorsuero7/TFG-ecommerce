import { DataSource, EntityTarget } from "typeorm";
import { OrderLine } from "../Models/orderLine.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { Order } from "../Models/order.entity";

export class OrderLineRepository extends TypeORMRepository<OrderLine, number> {
    constructor(datasource: DataSource){
        super(OrderLine, datasource)
    }

    async findByOrder (order: Order): Promise<OrderLine[]>{
        return await this.repo.findBy({ order})
    }
}