import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';
@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'varchar', length: 255 })
    description!: string;

    @OneToMany(
        () => Product,
        (product) => product.category,
    )
    products!: Product[];
}
