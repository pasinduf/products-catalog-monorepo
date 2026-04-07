import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Category } from "./Category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column("text", { nullable: true })
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Category, category => category.products, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @Column()
    categoryId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
