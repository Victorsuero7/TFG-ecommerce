import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToOne } from 'typeorm';
import { Address } from './address.entity';
import { Order } from './order.entity';

@Entity()
export class Photo {
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
