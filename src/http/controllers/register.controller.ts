import { RegisterUseCase } from '@/services/users/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/errors/user-already-exists';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);
    await registerUseCase.execute({ password, email, name });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send();
  }
  return reply.status(201).send();
}
