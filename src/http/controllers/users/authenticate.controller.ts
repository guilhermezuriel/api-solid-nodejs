import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AuthenticationUseCase } from '@/use-cases/users/authenticate';
import { InvalidCredentialsError } from '@/errors/invalid-credentials';
import { makeAuthenticationUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticationUseCase = makeAuthenticationUseCase();
    await authenticationUseCase.execute({ password, email });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
  return reply.status(200).send();
}
