import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import UsersRepository from '../../typeorm/repositories/UsersRepository';
import SessionsController from '../controllers/SessionsController';
import { celebrate, Joi, Segments } from 'celebrate';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/auth', celebrate({
    [Segments.BODY]: {
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }
}), sessionsController.create);

export default sessionsRouter;
