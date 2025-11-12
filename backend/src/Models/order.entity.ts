import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Photo } from './user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'date' })
    orderDate!: Date;

    @ManyToOne(
        () => Photo,
        (photo) => photo.id,
    )
    user!: Photo;
}
