import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["Username"])
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  @Length(4, 20)
  Username: string;

  @Column()
  @Length(4, 20)
  Email: string;

  @Column()
  @Length(4, 100)
  Password: string;

  @Column()
  @IsNotEmpty()
  Role: string;

  @Column()
  @CreateDateColumn()
  CreatedAt: Date;

  @Column()
  @UpdateDateColumn()
  UpdatedAt: Date;

  hashPassword() {
    this.Password = bcrypt.hashSync(this.Password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.Password);
  }
}
