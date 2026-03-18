import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

/**
 * Entidad que representa la línea en el pedido.
 * 
 * Contiene el precio, el número de uds. y su precio,
 * la orden a la que pertenece y el producto del que proviene.
 */
@Entity()
export class OrderLine {

    /**
     * Identificador único de la línea del pedido.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Cantidad de producto.
     */
    @Column({ type: 'int' })
    amount!: number;

    /**
     * Precio unitario del producto.
     */
    @Column({ type: 'decimal' })
    unitPrice!: number;

    /**
     * El pedido al que pertenece la línea.
     */
    @ManyToOne(
        () => Order,
        (order) => order.id,
    )
    order!: Order;

    /**
     * El producto al que corresponde el precio, la cantidad 
     * y el pedido.
     */
    @ManyToOne(
        () => Product,
        (product) => product.id,
    )
    product!: Product;
}
