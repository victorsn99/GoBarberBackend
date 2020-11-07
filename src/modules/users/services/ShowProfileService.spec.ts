import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../interfaces/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let showUserProfile: ShowProfileService;
let fakeUserRepository: FakeUserRepository;

describe('Show User Profile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        showUserProfile = new ShowProfileService(fakeUserRepository);
    });
    it('should be able to show user profile', async () => {

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        console.log(user.name);
        

        const profile = await showUserProfile.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
    });

    it('should not be able to show user profile from non-existing user', async () => {

        await expect(showUserProfile.execute({
            user_id: '123123123'
        })).rejects.toBeInstanceOf(AppError);
    });
})