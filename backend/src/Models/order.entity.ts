import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Entidad que representa un pedido.
 */
@Entity()
export class Order {

    /**
     * Identificador único del pedido.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Fecha del pedido.
     */
    @Column({ type: 'date' })
    orderDate!: Date;

    /**
     * Usuario al que pertenece el pedido.
     */
    @ManyToOne(
        () => User,
        (user) => user.id,
    )
    user!: User;
}
