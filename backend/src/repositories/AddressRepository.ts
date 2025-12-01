import { DataSource, EntityTarget } from "typeorm";
import { Address } from "../Models/address.entity";
import { TypeORMRepository } from "./TypeORMRepository";

export class AddressRepository extends TypeORMRepository <Address, number>{
    constructor(datasource: DataSource){
        super(Address, datasource)
    }

    async findByPopulation(population: string): Promise<Address | null>{
        return await this.repo.findOneBy({ population})
    }
}