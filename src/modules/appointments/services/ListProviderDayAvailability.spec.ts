import AppError from '@shared/errors/AppError';
import ListProvidersService from './ListProvidersService';
import ListProviderDayAvailability from './ListProviderDayAvailability';
import FakeAppointmentsRepository from '../interfaces/fakes/FakeAppointmentRepository';

let listProviderDayAvailability: ListProviderDayAvailability;
let fakeAppointmentRepository: FakeAppointmentsRepository;

describe('List Provider Appointments Availability', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailability(fakeAppointmentRepository);
    });

    it('should be able to show day availability from provider', async () => {
        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 14),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 15),
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 20, 10, 30).getTime(); //setar três horas a frente da hora atual
        });

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(availability).toEqual(expect.arrayContaining([
            { hour: 8, available: false},
            { hour: 9, available: false},
            { hour: 10, available: false},
            { hour: 11, available: true},
            { hour: 12, available: true},
            { hour: 13, available: true},
            { hour: 14, available: false},
            { hour: 15, available: false},
            { hour: 16, available: true},
            { hour: 17, available: true},
        ]));
    });
});