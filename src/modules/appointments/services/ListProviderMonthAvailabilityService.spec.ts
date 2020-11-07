import AppError from '@shared/errors/AppError';
import FakeUserRepository from '@modules/users/interfaces/fakes/FakeUserRepository';
import FakeAppointmentRepository from '@modules/appointments/interfaces/fakes/FakeAppointmentRepository';
import ListProvidersService from './ListProvidersService';
import ListMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listMonthAvailabilityService: ListMonthAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('List Provider Days in a Month Availability', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        listMonthAvailabilityService = new ListMonthAvailabilityService(fakeAppointmentRepository);
    });
    it('should be able to show available days to make an appointment in a month', async () => {
        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 11, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 12, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 13, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 16, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 17, 0, 0),
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            user_id: '123123123',
            date: new Date(2020, 4, 21, 8, 0, 0),
        });

        const availability = await listMonthAvailabilityService.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
        });

        expect(availability).toEqual(expect.arrayContaining([
            { day: 19, available: true},
            { day: 20, available: false},
            { day: 21, available: true},
            { day: 22, available: true},
        ]));
        
    });
})