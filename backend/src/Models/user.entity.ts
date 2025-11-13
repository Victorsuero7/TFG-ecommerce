import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToOne } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'varchar', length: 255 })
    lastName!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    phoneNumbre!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'date' })
    birthDate!: Date;
}
