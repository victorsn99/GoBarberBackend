import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '@modules/appointments/interfaces/fakes/FakeAppointmentRepository';
import ListProvidersAppointmentsService from './ListProvidersAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';


let listProvidersAppointmentsService: ListProvidersAppointmentsService;
let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('List Provider Appointments', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersAppointmentsService = new ListProvidersAppointmentsService(fakeAppointmentRepository, fakeCacheProvider);
    });
    it('should be able to list the appointments list the appointments from an provider', async () => {
        const ap1 = await fakeAppointmentRepository.create({
            provider_id: 'provider',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        const ap2 = await fakeAppointmentRepository.create({
            provider_id: 'provider',
            user_id: '123123123',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });

        const appointments = await listProvidersAppointmentsService.execute({
            provider_id: 'provider',
            day: 20,
            year: 2020,
            month: 5,
        });

        expect(appointments).toEqual(expect.arrayContaining([
            ap1,
            ap2,
        ]));
        
    });
})