import { expect, test } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';

test('Register Use Case', async () => {
  //It is important to maintain the performance on unit tests
  const registerUseCase = new RegisterUseCase({
    async findByEmail(email) {
      return null;
    },

    async create(data) {
      return {
        id: 'user',
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        createdAt: new Date(),
      };
    },
  });

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
