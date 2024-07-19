import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, expect, it } from 'vitest';
import { AuthenticationUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '@/errors/invalid-credentials';

describe('Authenticate Use Case', () => {
  it('Should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationUseCase(usersRepository);

    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(sut.execute({
      email:'kohndoe@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
