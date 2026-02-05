import { hash } from "bcrypt";
import { AdminUser } from "../enitity/AdminUser.entity";
import { Role } from "../enitity/Role.entity";
import { DataSource } from "typeorm";

export async function adminSeed(dataSource: DataSource) {
    console.log("Admin seeding started...")

    const adminUserRepo = dataSource.getRepository(AdminUser);
    const roleRepo = dataSource.getRepository(Role)

    const roleInstance = roleRepo.create({
        roleName: 'SUPER_ADMIN',

    })

    const role = await roleRepo.save(roleInstance)

    const password = await hash('Admin@123', 10)

    const userInstance = adminUserRepo.create({
        username: 'admin',
        password,
        roleId: role.id
    })

    await adminUserRepo.save(userInstance)

    console.log("Admin seeding completed...")



}