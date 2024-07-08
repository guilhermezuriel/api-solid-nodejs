import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyReply } from 'fastify';

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

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });
}
