import AppError from '@shared/errors/AppError';
import FakeUserRepository from '@modules/users/interfaces/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;
let fakeUserRepository: FakeUserRepository;

describe('List Provider', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersService = new ListProvidersService(fakeUserRepository, fakeCacheProvider);
    });
    it('should be able to list providers', async () => {

        const user1 = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const user2 = await fakeUserRepository.create({
            name: 'John Doe 2',
            email: 'johndoe2@example.com',
            password: '123456',
        });

        const loggedUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
})