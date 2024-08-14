import { GymNotFoundError } from '@/errors/gym-not-found-error';
import { InvalidCredentialsError } from '@/errors/invalid-credentials';
import { MaxDistanceError } from '@/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error';
import { CheckInsRepository } from '@/repositories/checkin-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { CheckIn, User } from '@prisma/client';
import { compare } from 'bcryptjs';

interface fetchUserCheckInsHistoryCaseRequest {
  userId: string;
}

interface fetchUserCheckInsHistoryCaseResponse {
  checkIns: CheckIn[];
}

export class fetchUserCheckInsHistoryCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: fetchUserCheckInsHistoryCaseRequest): Promise<fetchUserCheckInsHistoryCaseResponse> {
    const checkIns = await this.checkinsRepository.findManyByUserId(userId);
    return {
      checkIns,
    };
  }
}
