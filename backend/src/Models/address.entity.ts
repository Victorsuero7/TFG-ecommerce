import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

/**
 * Entidad que representa la dirección de un usuario.
 */
@Entity()
export class Address {

    /**
     * Identificador único de la dirección.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Calle.
     */
    @Column({ type: 'varchar', length: 255 })
    street!: string;

    /**
     * Número de la vivienda.
     */
    @Column({ type: 'varchar', length: 255 })
    number!: string;

    /**
     * Piso.
     */
    @Column({ type: 'varchar', length: 255 })
    floor!: string;

    /**
     * Población.
     */
    @Column({ type: 'varchar', length: 255 })
    population!: string;

    /**
     * País de la dirección.
     */
    @Column({ type: 'varchar', length: 255 })
    country!: string;

    /**
     * Usuario o usuarios que tienen una o varias 
     * direcciones.
     */
    @ManyToMany(
        () => User,
        (user) => user.id,
    )
    users!: User[];
}
