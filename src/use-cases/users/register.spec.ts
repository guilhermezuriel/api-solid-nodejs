import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '@/errors/user-already-exists';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register User Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('Should be able to register a user', async () => {
    const { user } = await sut.execute({
      name: 'John Node',
      email: 'johnnode@example.com',
      password: '123456',
    });

    expect((await user).id).toEqual(expect.any(String));
  });

  it('Should hash user password upon registration', async () => {
    //It is important to maintain the performance on unit tests

    const { user } = await sut.execute({
      name: 'John Node',
      email: 'johnnode@example.com',
      password: '123456',
    });
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      (
        await user
      ).password_hash,
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('Should not be able to register with the same email twice', async () => {
    const email = 'JohnNode@example.com';

    await sut.execute({
      name: 'John Node',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        name: 'John Node',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
