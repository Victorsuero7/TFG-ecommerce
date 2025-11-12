import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderLine {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    amount!: number;

    @Column({ type: 'decimal' })
    unitPrice!: number;

    @ManyToOne(
        () => Order,
        (order) => order.id,
    )
    order!: Order;

    @ManyToOne(
        () => Product,
        (product) => product.id,
    )
    product!: Product;
}
