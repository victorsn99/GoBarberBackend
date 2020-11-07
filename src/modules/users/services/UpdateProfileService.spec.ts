import FakeUserRepository from '../interfaces/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateProfileService;

describe('Update User Profile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        updateUserProfile = new UpdateProfileService(fakeUserRepository, fakeHashProvider);
    });
    it('should be able to update user profile', async () => {

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateUserProfile.execute({
            user_id: user.id,
            name: 'Hosea Matthews',
            email: 'hosea_matthews@example.com'
        });

        expect(updatedUser.name).toBe('Hosea Matthews');
        expect(updatedUser.email).toBe('hosea_matthews@example.com');
    });

    it('should not be able to change to another existing email', async () => {

        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe222@example.com',
            password: '123456',
        });

        const user = await fakeUserRepository.create({
            name: 'John Doe aaaa',
            email: 'johndoe21312321@example.com',
            password: '12345213213312',
        });

        await expect(updateUserProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe222@example.com'
        }),).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update user password', async () => {

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateUserProfile.execute({
            user_id: user.id,
            name: 'Hosea Matthews',
            email: 'hosea_matthews@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update user password without old password', async () => {

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(updateUserProfile.execute({
            user_id: user.id,
            name: 'Hosea Matthews',
            email: 'hosea_matthews@example.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update user password with wrong old password', async () => {

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(updateUserProfile.execute({
            user_id: user.id,
            name: 'Hosea Matthews',
            email: 'hosea_matthews@example.com',
            old_password: 'wrong-old-password',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });
})