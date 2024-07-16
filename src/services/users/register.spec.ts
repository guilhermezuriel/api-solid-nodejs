import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '@/errors/user-already-exists';

describe('Register User Case', () => {
  it('Should be able to register a user', async () => {
    const UsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(UsersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Node',
      email: 'johnnode@example.com',
      password: '123456',
    });

    expect((await user).id).toEqual(expect.any(String));
  });

  it('Should hash user password upon registration', async () => {
    //It is important to maintain the performance on unit tests
    const UsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(UsersRepository);

    const { user } = await registerUseCase.execute({
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
    const UsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(UsersRepository);

    const email = 'JohnNode@example.com';

    await registerUseCase.execute({
      name: 'John Node',
      email,
      password: '123456',
    });

    expect(() =>
      registerUseCase.execute({
        name: 'John Node',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
