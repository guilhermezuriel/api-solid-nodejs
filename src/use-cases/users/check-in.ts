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

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkinsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new GymNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }
    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });
    return { checkIn };
  }
}
