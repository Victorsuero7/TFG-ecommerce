import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity()
export class CartLine {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    amount!: number;

    @ManyToOne(
        () => Cart,
        (cart) => cart.id,
    )
    cart!: Cart;

    @ManyToOne(
        () => Product,
        (product) => product.id,
    )
    product!: Product;
}
