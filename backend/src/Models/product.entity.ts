import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

/**
 * Entidad que representa un producto en el sistema.
 * 
 * Contiene información básica para su gestión en inventario.
 */
@Entity()
export class Product {

    /**
     * Identificador único del producto.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Número de serie del producto
     * No se utiliza actualmente, se puede habilitar según las necesidades
     * del cliente.
     */
    // @Column({ type: 'int' })
    // serialNumber!: number

    /**
     * Nombre del producto.
     */
    @Column({ type: 'varchar', length: 255 })
    name!: string;

    /**
     * Descripción breve del producto.
     */
    @Column({ type: 'varchar', length: 255 })
    description!: string;

    /**
     * Precio del producto.
     */
    @Column({ type: 'decimal' })
    price!: number;

    /**
     * Talla o tamaño del producto.
     */
    @Column({ type: 'varchar', length: 255 })
    size!: string;

    /**
     * Stock del producto.
     * Indica el número de unidades disponibles en el sistema.
     */
    @Column({ type: 'int' })
    stock!: number;

    /**
     * Imagen del producto.
     */
    @Column({ type: "varchar", length: 255, default: null })
    imageUrl!: string

    /**
     * Fecha de modificación.
     * Indica cuándo ha sido la última modificación de stock de un producto.
     */
    @UpdateDateColumn()
    lastModification!: Date

    /**
     * Usuario que ha realizado la modificación.
     */
    @ManyToOne(() => User)
    modifiedBy!: User

    /**
     * Categoría a la que pertenece el producto.
     */
    @ManyToOne(
        () => Category,
        (category) => category.products,
    )
    category!: Category;

    /**
     * Indica si el producto está habilitado.
     */
    @Column({ type: "boolean", default: true })
    enable!: boolean
}
