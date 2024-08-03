import { beforeEach, describe, expect, it } from 'vitest';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '@/errors/user-already-exists';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';
import { Decimal } from '@prisma/client/runtime/library';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Register User Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('Should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'smartfit-1',
      description: 'smart gym',
      phone: '7998809100',
      latitude: 1000000,
      longitude: 100000,
    });

    expect((await gym).id).toEqual(expect.any(String));
  });

});
