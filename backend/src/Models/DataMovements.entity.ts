import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

/**
 * Entidad que representa las modificaciones que se pueden
 * hacer sobre un producto.
 */
@Entity()
export class Movement {

    /**
     * Identificador único de los movimientos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Usuario que ha realizado el movimiento.
     */
    @ManyToOne(() => User)
    modifiedBy!: User

    /**
     * El producto que ha sido movido.
     */
    @ManyToOne(() => Product)
    product!: Product;

    /**
     * Stock resultado del movimiento.
     */
    @Column({ type: 'int' })
    finalStock!: number;

    /**
     * Fecha de última modificación.
     */
    @UpdateDateColumn()
    lastModification!: Date
}
