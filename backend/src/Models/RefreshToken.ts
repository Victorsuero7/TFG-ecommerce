import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
    @PrimaryColumn()
    token!: number;

    @Column({ type: 'date' })
    validUntil!: Date; //new Date().getTime() + 5*60*60*1000

    @Column({ type: 'boolean' })
    enabled!: boolean

    @ManyToOne(
        () => User,
        (user) => user.id,
    )
    user!: User;
}
