import FakeUserRepository from '../interfaces/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import AuthUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeCacheProvider: FakeCacheProvider;
let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authUser: AuthUserService;
let createUser: CreateUserService;

describe('Authenticate User', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        authUser = new AuthUserService(fakeUserRepository, fakeHashProvider);
    })
    it('should be able to authenticate', async () => {

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const response = await authUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);

    });

    it('shouldnt be able to authenticate with non existing user', async () => {

        expect(authUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);

    });

    it('shouldnt be able to authenticate with incorrect password/user', async () => {

        expect(authUser.execute({
            email: 'johndoe@example.com',
            password: '654321',
        })).rejects.toBeInstanceOf(AppError);

    });

    
    

    
})