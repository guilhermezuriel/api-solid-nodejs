import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';
import { randomUUID } from 'crypto';

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);
  });

  it('Should be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
