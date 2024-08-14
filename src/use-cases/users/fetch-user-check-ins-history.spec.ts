import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';
import { randomUUID } from 'crypto';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error';
import { MaxDistanceError } from '@/errors/max-distance-error';
import { fetchUserCheckInsHistoryCase } from './fetch-user-check-ins-history';

let checkInRepository: InMemoryCheckInRepository;
let sut: fetchUserCheckInsHistoryCase;

describe('Fetch Check-in User Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new fetchUserCheckInsHistoryCase(checkInRepository);
  });

  it('Should be able to fetch check-in history', async () => {
    await checkInRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    });

    await checkInRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2',
    });

    const { checkIns } = await sut.execute({ userId: 'user-1', page: 1 });

    expect(checkIns).toHaveLength(2);

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ]);
  });

  it('Should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: 'user-1',
        gym_id: `gym-${i}`,
      });
    }

    const { checkIns } = await sut.execute({ userId: 'user-1', page: 2 });

    expect(checkIns).toHaveLength(2);

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});
