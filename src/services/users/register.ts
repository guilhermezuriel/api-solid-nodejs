import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcryptjs';

interface RegisterService {
  password: string;
  email: string;
  name: string;
}

export async function registerService({
  password,
  email,
  name,
}: RegisterService) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.');
  }

  const prismaUsersRepository = new PrismaUsersRepository();

  prismaUsersRepository.create({ name, email, password_hash });
}
