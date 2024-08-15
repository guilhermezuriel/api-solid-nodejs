import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';
import { randomUUID } from 'crypto';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error';
import { MaxDistanceError } from '@/errors/max-distance-error';
import { fetchUserCheckInsHistoryCase } from './fetch-user-check-ins-history';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe('Fetch Check-in User Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it('Should be to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-1',
    });

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-1',
    });

    await checkInRepository.create({
      gym_id: 'gym-03',
      user_id: 'user-1',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(3);
  });
});
