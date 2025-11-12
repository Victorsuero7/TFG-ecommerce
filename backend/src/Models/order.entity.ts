import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'date' })
    orderDate!: Date;

    @ManyToOne(
        () => User,
        (user) => user.id,
    )
    user!: User;
}
