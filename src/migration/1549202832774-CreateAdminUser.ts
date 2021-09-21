import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entity";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.Username = "admin";
    user.Password = "admin";
    user.hashPassword();
    user.Role = "ADMIN";
    user.Email = "phpapp@hotmail.com";
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
