import { DataSource, EntityTarget } from "typeorm";
import { Cart, cartState } from "../Models/cart.entity";
import { TypeORMRepository } from "./TypeORMRepository";
import { User } from "../Models/user.entity";

export class CartRepository extends TypeORMRepository <Cart, number>{
    constructor(datasource: DataSource){
        super(Cart, datasource)
    }

    async findByDate(cartDate: Date): Promise<Cart []>{
        return await this.repo.findBy({ cartDate})
    }

    async findByState(state: cartState): Promise<Cart[]>{
        return await this.repo.findBy({ state})
    }

    async findByUser(user: User): Promise<Cart[]>{
        return await this.repo.findBy({ user})
    }
}