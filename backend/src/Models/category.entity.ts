import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entidad que representa la categoría a la que puede pertenecer
 * uno o varios productos.
 */
@Entity()
export class Category {

    /**
     * Identificador único de la categoría.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Nombre de la categoría.
     */
    @Column({ type: 'varchar', length: 255 })
    name!: string;

    /**
     * Descripción breve de la categoría.
     */
    @Column({ type: 'varchar', length: 255 })
    description!: string;

    /**
     * Productos que pertenecen a la categoría.
     */
    @OneToMany(
        () => Product,
        (product) => product.category,
    )
    products!: Product[];
}
