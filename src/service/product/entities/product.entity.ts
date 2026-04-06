import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
    name: 'product_id',
  })
  product_id!: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'product_name',
  })
  product_name!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'product_price',
  })
  product_price!: number;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at',
  })
  updated_at!: Date;
}
