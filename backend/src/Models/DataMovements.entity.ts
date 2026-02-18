import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Movement {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    modifiedBy!: User

    @ManyToOne(() => Product)
    product!: Product;

    @Column({ type: 'int' })
    finalStock!: number;

    @UpdateDateColumn()
    lastModification!: Date
}
