import { DataSource, } from "typeorm";

import { TypeORMRepository } from "./TypeORMRepository";
import { RefreshToken } from "../Models/RefreshToken";


export class RefreshTokenRepository extends TypeORMRepository<RefreshToken, number> {
    constructor(datasource: DataSource) {
        super(RefreshToken, datasource)
    }

    async getToken(token: string): Promise<RefreshToken | null> {
        return await this.repo.findOneBy({ token })
    }

}