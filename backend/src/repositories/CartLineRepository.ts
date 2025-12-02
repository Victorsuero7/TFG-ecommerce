import { DataSource, EntityTarget } from "typeorm";
import { CartLine } from "../Models/cartLine";
import { TypeORMRepository } from "./TypeORMRepository";
import { Cart } from "../Models/cart.entity";

export class CartLineRepository extends TypeORMRepository <CartLine, number>{
    constructor(datasource: DataSource){
        super(CartLine, datasource)
    }

    async findByCart (cart: Cart): Promise<CartLine[]>{
        return await this.repo.findBy({ cart})
    }

    async findByAmount (amount: number): Promise<CartLine[]>{
        return await this.repo.findBy({ amount})
    }
}