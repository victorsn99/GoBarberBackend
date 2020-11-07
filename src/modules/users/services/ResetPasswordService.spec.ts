import 'reflect-metadata';
import FakeUserRepository from '../interfaces/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserTokenRepository from '../interfaces/fakes/FakeUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';
import AppError from '@shared/errors/AppError';

describe('Reset Password Service', () => {

    it('should be able to reset the password', async () => {

        const fakeHashProvider = new FakeHashProvider();
        const fakeUserRepository = new FakeUserRepository();
        const fakeUserTokensRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUserRepository, fakeUserTokensRepository, fakeHashProvider);

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(
            user.id
        );

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '123123',
            token,
        });

        const updatedUser = await fakeUserRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('shouldnt be able to reset password if passed more than two hours', async () => {
        const fakeHashProvider = new FakeHashProvider();
        const fakeUserRepository = new FakeUserRepository();
        const fakeUserTokensRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUserRepository, fakeUserTokensRepository, fakeHashProvider);

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(
            user.id
        );

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const newDate = new Date();
            return newDate.setHours(newDate.getHours() + 3); //setar três horas a frente da hora atual
        }); //espionar quando a função date.now() foi chamada e substitui-la por outra função de minha escolha

        await expect(resetPasswordService.execute({
            token,
            password: '123123'
        })).rejects.toBeInstanceOf(AppError)
    });

    it('shouldnt be able to reset password with non existing token', async () => {

        const fakeHashProvider = new FakeHashProvider();
        const fakeUserRepository = new FakeUserRepository();
        const fakeUserTokensRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUserRepository, fakeUserTokensRepository, fakeHashProvider);

        await expect(resetPasswordService.execute({
            token: 'aaa123',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError)
    });

    it('shouldnt be able to reset password with non existing user', async () => {

        const fakeHashProvider = new FakeHashProvider();
        const fakeUserRepository = new FakeUserRepository();
        const fakeUserTokensRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUserRepository, fakeUserTokensRepository, fakeHashProvider);

        const { token } = await fakeUserTokensRepository.generate(
            'aaaa1232123'
        );

        await expect(resetPasswordService.execute({
            token,
            password: '123456'
        })).rejects.toBeInstanceOf(AppError)
    });

    
})