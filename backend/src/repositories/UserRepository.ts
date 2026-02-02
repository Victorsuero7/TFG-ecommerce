import { DataSource } from "typeorm";
import { User } from "../Models/user.entity";
import { TypeORMRepository } from "./TypeORMRepository";


export class UserRepository extends TypeORMRepository<User, number> {
    constructor(datasource: DataSource) {
        super(User, datasource)
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repo.findOneBy({ email })
    }
} 