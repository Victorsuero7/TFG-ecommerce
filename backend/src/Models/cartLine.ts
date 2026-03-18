import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

/**
 * Entidad que representa una línea en el carrito de compra.
 */
@Entity()
export class CartLine {

    /**
     * Identificador único de la línea de carrito.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Cantidad de productos.
     */
    @Column({ type: 'int' })
    amount!: number;

    /**
     * Carrito al que pertenece la línea.
     */
    @ManyToOne(
        () => Cart,
        (cart) => cart.id,
    )
    cart!: Cart;

    /**
     * Producto que está en la línea del carrito.
     */
    @ManyToOne(
        () => Product,
        (product) => product.id,
    )
    product!: Product;
}
