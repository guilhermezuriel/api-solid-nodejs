import { InvalidCredentialsError } from '@/errors/invalid-credentials';
import { CheckInsRepository } from '@/repositories/checkin-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { CheckIn, User } from '@prisma/client';
import { compare } from 'bcryptjs';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new Error();
    }
    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });
    return { checkIn };
  }
}
