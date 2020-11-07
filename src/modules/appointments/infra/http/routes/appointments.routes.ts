import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

//appointmentsRouter.get('/', async (request, response) => {
  //console.log(request.user);
  //const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  //const appointments = await appointmentsRepository.find();

  //return response.json(appointments);
//});

appointmentsRouter.post('/create', celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    user_id: Joi.string().uuid().required(),
    date: Joi.required(),
  },
}), appointmentsController.create);

appointmentsRouter.get('/me', providerAppointmentsController.index);


export default appointmentsRouter;
