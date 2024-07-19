import { UserNotFoundError } from '@/errors/user-not-found';
import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';

interface GetUserUseCaseRequest {
  id: string;
}

interface GetUserUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return { user };
  }
}
