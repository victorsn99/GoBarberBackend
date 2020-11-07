import FakeUserRepository from '../interfaces/fakes/FakeUserRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotEmailPasswordService from './SendForgotEmailService';
import FakeUserTokenRepository from '../interfaces/fakes/FakeUserTokenRepository';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotEmailPasswordService;

describe('Send Forgot Password Email', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokenRepository();
        sendForgotPasswordEmail = new SendForgotEmailPasswordService(fakeMailProvider, fakeUserRepository, fakeUserTokensRepository);
    });
    it('should be able to recover the password using email', async () => {
        
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const user = await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('shouldnt be able to recover a non-existing password', async () => {

        await expect(sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot test token', async () => {

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        expect(generateToken).toBeCalledWith(user.id);
    });

})