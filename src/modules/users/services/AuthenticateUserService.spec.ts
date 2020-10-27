import FakeUserRepository from '../interfaces/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import AuthUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('Authenticate User', () => {
    it('should be able to authenticate', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authUser = new AuthUserService(fakeUserRepository, fakeHashProvider);
        const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

        const user = await createUser.execute({
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
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authUser = new AuthUserService(fakeUserRepository, fakeHashProvider);

        expect(authUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);

    });

    it('shouldnt be able to authenticate with incorrect password/user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authUser = new AuthUserService(fakeUserRepository, fakeHashProvider);
        const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(authUser.execute({
            email: 'johndoe@example.com',
            password: '654321',
        })).rejects.toBeInstanceOf(AppError);

    });

    
    

    
})