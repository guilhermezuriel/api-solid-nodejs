import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';
import { FetchNearbyGymsCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsCase;

describe('Fetch Nearby Gyms', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsCase(gymsRepository);
  });

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'smart gym',
      phone: '7998809100',
      latitude: -10.9426235,
      longitude: -37.0790481,
    });

    await gymsRepository.create({
      title: 'Near Gym 2',
      description: 'smart gym',
      phone: '7998809100',
      latitude: -10.9426235,
      longitude: -37.0790481,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'smart gym',
      phone: '7998809100',
      latitude: -8.114767,
      longitude: -34.9110765,
    });

    const { gyms } = await sut.execute({
      userLatitude: -10.9426235,
      userLongitude: -37.0790481,
    });

    expect(gyms).toHaveLength(2);
  });
});
