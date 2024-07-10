import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';

interface RegisterService {
  password: string;
  email: string;
  name: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ password, email, name }: RegisterService) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('E-mail already exists.');
    }

    this.usersRepository.create({ name, email, password_hash });
  }
}
