import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';
import { randomUUID } from 'crypto';

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useFakeTimers();
  });

  it('Should be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('Should not be able to checkin in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
