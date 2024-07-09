import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

interface RegisterService {
  password: string;
  email: string;
  name: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ password, email, name }: RegisterService) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new Error('E-mail already exists.');
    }

    this.usersRepository.create({ name, email, password_hash });
  }
}
