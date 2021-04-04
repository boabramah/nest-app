import { hash } from 'bcrypt'
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;  

  @Column()
  @Exclude()
  password: string;  

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;  
  
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;  

  @BeforeInsert()
  async hashPassword(){
    this.password = await hash(this.password, 10);
  }
}
