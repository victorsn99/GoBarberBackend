import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../interfaces/fakes/FakeAppointmentRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
    it('should be able to create a neew appointment', async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentRepository);

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123123123',
        });

        expect(appointment).toHaveProperty('id');
    });

    it('shouldnt be able to create two appointments on same time', async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentRepository);

        const appointmentDate = new Date(2020, 4, 10, 11);

        const appointment = await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123123',
        });

        expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);
    });
})