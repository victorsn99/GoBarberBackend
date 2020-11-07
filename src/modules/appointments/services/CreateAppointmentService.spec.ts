import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../interfaces/fakes/FakeAppointmentRepository';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/interfaces/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointmentService(fakeAppointmentRepository, fakeNotificationsRepository, fakeCacheProvider);
    });
    it('should be able to create a new appointment', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123456',
            provider_id: '123123123',
        });

        expect(appointment).toHaveProperty('id');
    });

    it('shouldnt be able to create two appointments on same time', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointmentDate = new Date(2020, 4, 10, 13);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: '123456',
            provider_id: '123123123',
        });

        await expect(createAppointment.execute({
            date: appointmentDate,
            user_id: '123456',
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('shouldnt be able to create two appointments on a past date', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            user_id: '123456',
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('shouldnt be able to create an appointment with same user and provider', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            user_id: '123123123',
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('shouldnt be able to create an appointment before 8am and after 18pm', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 4),
            user_id: '123456',
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);
    });
})