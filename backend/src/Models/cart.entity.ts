import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
export type cartState = 'active' | 'abandoned' | 'bought';
import { User } from './user.entity';

/**
 * Entidad que representa un carrito de compra.
 * 
 * Actualmente no está en uso, pero se puede utilizar dependiendo de las 
 * necesidades del cliente.
 */
@Entity()
export class Cart {

    /**
     * Identificador único del carrito.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Fecha de la creación del carrito.
     */
    @Column({ type: 'date' })
    cartDate!: Date;

    /**
     * Estado del carrito.
     * 
     * Puede estar activo, abandonado o comprado.
     */
    @Column({ type: 'enum', enum: ['active', 'abandoned', 'bought'], default: 'active' })
    state!: cartState;

    /**
     * Usuario que ha creado el carrito.
     */
    @ManyToOne(
        () => User,
        (user) => user.id,
    )
    user!: User;
}
