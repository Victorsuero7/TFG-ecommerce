import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Roles disponibles dentro del sistema.
 * 
 * Determinan los permisos y nivel de acceso que tiene un usuario.
 */

export type ROLE = "ADMIN" | "ROOT" | "USER"


/**
 * Entidad que representa un usuario del sistema.
 * 
 * Contiene la información básica de identificación, autenticación y 
 * autorización de los usuarios registrados en la plataforma.
 */
@Entity()
export class User {

    /**
     * Identificador único del usuario.
     * 
     * Se genera automáticamente por la base de datos.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Nombre del usuario.
     */
    @Column({ type: 'varchar', length: 255 })
    name!: string;

    /**
     * Apellidos del usuario.
     */
    @Column({ type: 'varchar', length: 255 })
    lastName!: string;

    /**
     * Número de teléfono del usuario.
     * Actualmente se permite nulo durante el desarrollo, en producción debe ser obligatorio.
     */
    @Column({ type: 'varchar', length: 255, unique: true, nullable: true }) // remove nullable on production
    phoneNumber!: string;

    /**
     * Correo electrónico del usuario.
     * Debe ser único en el sistema y se utiliza como identificador para la autenticación.
     */
    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    /**
     * Contraseña del usuario.
     * Debe almacenarse siempre cifrada (hash), utilizando un algoritmo como bcrypt.
     */
    @Column({ type: 'varchar', length: 255 })
    password!: string;

    /**
     * Rol asignado al usuario.
     * Define los permisos que tendrá el usuario dentro de la aplicación.
     */
    @Column({ type: 'enum', default: "USER", enum: ["ADMIN", "ROOT", "USER"] })
    role!: ROLE;

    /**
     * Indica si la cuenta del usuario está habilitada.
     * Estando deshabilitada el usuario no podrá iniciar sesión.
     */
    @Column({ type: 'boolean', default: true })
    enable!: boolean

    /**
     * Fecha de nacimiento del usuario.
     * Campo opcional no utilizado actualmente.
     */
    // @Column({ type: 'date' })
    // birthDate!: Date;
}
