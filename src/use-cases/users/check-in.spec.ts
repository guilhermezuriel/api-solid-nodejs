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
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useFakeTimers();
  });

  it('Should be able to checkIn', async () => {
    gymsRepository.items.push({
      id: 'gym-1',
      title: 'Javascript Gym',
      description: '',
      phone: '1200323',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
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
});
