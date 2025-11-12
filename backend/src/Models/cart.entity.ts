import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
export type cartState = 'active' | 'abandoned' | 'bought';
import { User } from './user.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'date' })
    cartDate!: Date;

    @Column({ type: 'enum', enum: ['active', 'abandoned', 'bought'], default: 'active' })
    state!: cartState;

    @ManyToOne(
        () => User,
        (user) => user.id,
    )
    user!: User;
}
