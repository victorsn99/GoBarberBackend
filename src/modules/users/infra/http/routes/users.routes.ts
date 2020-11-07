import { Router } from 'express';
import { container } from 'tsyringe';

import multer from 'multer';
import uploadConfig from '../../../../../config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';
import { celebrate, Joi, Segments } from 'celebrate';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();


const upload = multer(uploadConfig.multer);

usersRouter.post('/create', celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    },
}), usersController.create);

usersRouter.patch('/avatar/update', ensureAuthenticated, upload.single('avatar'), userAvatarController.update);

export default usersRouter;
