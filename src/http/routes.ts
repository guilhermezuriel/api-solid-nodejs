import fastify, { FastifyInstance } from 'fastify';
import { register } from './controllers/users/register.controller';
import { authenticate } from './controllers/users/authenticate.controller';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);
}
