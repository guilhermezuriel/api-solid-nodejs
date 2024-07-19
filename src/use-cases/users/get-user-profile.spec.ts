import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { UserNotFoundError } from '@/errors/user-not-found';

describe('Get User Use Case Tests', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('Should not be to find a user with wrong id', async () => {
    const createdUser = await usersRepository.create({
      name: 'Node jr',
      email: 'nodejr@example.com',
      password_hash: await hash('12345', 6),
    });
    const wrongId = randomUUID.toString();

    expect(
      async () => await sut.execute({ id: wrongId }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('Should not be to find a user with wrong id', async () => {
    const createdUser = await usersRepository.create({
      name: 'Node jr',
      email: 'nodejr@example.com',
      password_hash: await hash('12345', 6),
    });
    const id = createdUser.id;

    const { user } = await sut.execute({ id: id });

    expect(user).toEqual(createdUser);
  });
});
