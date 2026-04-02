import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

/**
 * Entidad que representa el pago de una transacción.
 * 
 * Actualmente no se está utilizando.
 */
@Entity()
export class Pay {

    /**
     * Identificador único del pago.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Importe del pago.
     */
    @Column({ type: 'int' })
    amount!: number;

    /**
     * Fecha del pago.
     */
    @Column({ type: 'date' })
    payDate!: Date;

    /**
     * Usuario que ha realizado el pago.
     */
    @ManyToOne(
        () => User,
        (user) => user.id,
    )
    user!: User;

    /**
     * Orden a la que pertenece el pago.
     */
    @ManyToOne(
        () => Order,
        (order) => order.id,
    )
    order!: Order;
}
