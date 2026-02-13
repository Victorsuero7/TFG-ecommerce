import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'varchar', length: 255 })
    description!: string;

    @Column({ type: 'decimal' })
    price!: number;

    @Column({ type: 'varchar', length: 255 })
    size!: string;

    @Column({ type: 'int' })
    stock!: number;

    @Column({ type: "varchar", length: 255 })
    imageUrl!: string

    @ManyToOne(
        () => Category,
        (category) => category.products,
    )
    category!: Category;

    @Column({ type: "boolean", default: true })
    enable!: boolean
}
