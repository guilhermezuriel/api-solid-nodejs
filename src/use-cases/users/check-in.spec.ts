import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';
import { randomUUID } from 'crypto';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-1',
      title: 'Javascript Gym',
      description: '',
      phone: '1200323',
      latitude: 10000000,
      longitude: 10000000,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 10000000,
      userLongitude: 10000000,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('Should not be able to checkin in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 10000000,
      userLongitude: 1000000,
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: 10000000,
        userLongitude: 1000000,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
  it('Should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-2',
      title: 'Javascript Gym',
      description: '',
      phone: '1200323',
      latitude: new Decimal(-10.8948882),
      longitude: new Decimal(-37.0639347),
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-2',
        userLatitude: -10.8386292,
        userLongitude: -37.0781844,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
