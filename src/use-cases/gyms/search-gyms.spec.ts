import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { InMemorygymsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';
import { randomUUID } from 'crypto';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error';
import { MaxDistanceError } from '@/errors/max-distance-error';
import { fetchUserCheckInsHistoryCase } from './fetch-user-check-ins-history';
import { SearchGymsUseCase } from './search-gyms';
import { title } from 'process';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Fetch Check-in User Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('Should be able to fetch check-in history', async () => {
    await gymsRepository.create({
      title: 'Javascript-Gym',
      description: 'smart gym',
      phone: '7998809100',
      latitude: 1000000,
      longitude: 100000,
    });

    await gymsRepository.create({
      title: 'Java-Gym',
      description: 'smart gym',
      phone: '7998809100',
      latitude: 1000000,
      longitude: 100000,
    });

    const { gyms } = await sut.execute({ query: 'Javascript', page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript-Gym' }),
    ]);
  });

  it('Should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript-Gym ${i}`,
        description: 'smart gym',
        phone: '7998809100',
        latitude: 1000000,
        longitude: 100000,
      });
    }

    const { gyms } = await sut.execute({ query: 'Javascript', page: 2 });

    expect(gyms).toHaveLength(2);

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript-Gym 21' }),
      expect.objectContaining({ title: 'Javascript-Gym 22' }),
    ]);
  });
});
