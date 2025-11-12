import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    street!: string;

    @Column({ type: 'varchar', length: 255 })
    number!: string;

    @Column({ type: 'varchar', length: 255 })
    floor!: string;

    @Column({ type: 'varchar', length: 255 })
    population!: string;

    @Column({ type: 'varchar', length: 255 })
    country!: string;

    @ManyToMany(
        () => User,
        (user) => user.id,
    )
    users!: User[];
}
