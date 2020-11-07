import ListProvidersAppointmentService from '@modules/appointments/services/ListProvidersAppointmentsService';
import { parseISO } from 'date-fns';
import { Request, Response} from 'express';
import { container } from 'tsyringe';

export default class ProviderAppointmentsController {
    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.user.id;
        const { day, month, year } = request.body;

        const providerAppointmentsController = container.resolve(ListProvidersAppointmentService);

        const appointments = await providerAppointmentsController.execute({ provider_id, day, month, year});

        return response.json(appointments);
    }
}