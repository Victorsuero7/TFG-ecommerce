import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

type ROLE = "ADMIN" | "ROOT" | "USER"


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'varchar', length: 255 })
    lastName!: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true }) // remove nullable on production
    phoneNumber!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @Column({ type: 'enum', default: "USER", enum: ["ADMIN", "ROOT", "USER"] })
    role!: ROLE;

    @Column({ type: 'date' })
    birthDate!: Date;
}
