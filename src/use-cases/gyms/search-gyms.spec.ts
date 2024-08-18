import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('Should be able to search for many gyms', async () => {
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
