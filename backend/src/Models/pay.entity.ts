import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
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
        () => User,
        (user) => user.id,
    )
    user!: User;

    @ManyToOne(
        () => Order,
        (order) => order.id,
    )
    order!: Order;
}
