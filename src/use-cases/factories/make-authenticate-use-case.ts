import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticationUseCase } from '../users/authenticate';
export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticationUseCase(usersRepository);
  return authenticateUseCase;
}
