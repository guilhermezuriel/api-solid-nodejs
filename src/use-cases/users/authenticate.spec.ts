import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticationUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '@/errors/invalid-credentials';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticationUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticationUseCase(usersRepository);
  });

  it('Should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(
      sut.execute({
        email: 'kohndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
