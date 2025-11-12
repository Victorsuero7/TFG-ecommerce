import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Photo } from './user.entity';
import { Order } from './order.entity';

@Entity()
export class Pay {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    amount!: number;

    @Column({ type: 'date' })
    payDate!: Date;

    @ManyToOne(
        () => Photo,
        (photo) => photo.id,
    )
    user!: Photo;

    @ManyToOne(
        () => Order,
        (order) => order.id,
    )
    order!: Order;
}
