import { User } from '../Models/user.entity';
import { UserService } from './UserService';
import { UserRepository } from '../repositories/UserRepository';

export class UserServiceImpl implements UserService {
    constructor(repository: UserRepository) {
        this.userRepo = repository;
    }
    private readonly userRepo;

    async findOneById(id: number): Promise<User | null> {
        try {
            return await this.userRepo.findOneBy({ id: id });
        } catch (error) {
            console.log(error); //Should by replaced by Logger class
            throw error; // Maybe should be replace by custom errors (at least in controllers)
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepo.findOneBy({ email: email });
        } catch (error) {
            console.log(error); //Should by replaced by Logger class
            throw error; // Maybe should be replace by custom errors (at least in controllers)
        }
    }
    async findAll(): Promise<User[]> {
        try {
            return await this.userRepo.find();
        } catch (error) {
            console.log(error); //Should by replaced by Logger class
            throw error; // Maybe should be replace by custom errors (at least in controllers)
        }
    }

    async deleteOne(id: number): Promise<number> {
        try {
            let result = await this.userRepo.delete({ id });
            //delte y remove se comportan diferente
            return result.affected || 0;
            // return result != null ? 1 : 0
        } catch (error) {
            console.log(error); //Should by replaced by Logger class
            throw error; // Maybe should be replace by custom errors (at least in controllers)
        }
    }

    async insertOne(data: User): Promise<User> {
        //save e insert se comportan diferente, save sirve tanto para insertar como actualizar
        try {
            return await this.userRepo.save(data);
        } catch (error) {
            console.log(error);
            throw error; // Maybe should be replace by custom errors (at least in controllers)
        }
    }
}
