import { injectable, inject } from 'tsyringe';
import User from "@modules/users/infra/typeorm/entities/User";
import path from 'path';
import uploadConfig from "@config/upload";
import fs from 'fs';
import AppError from '@shared/errors/AppError';
import IUsersRepository from "../interfaces/IUsersRepository";
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';


interface Request {
  user_id: string,
  avatarFilename: string,
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    ) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar); //deleta avatar anterior e abaixo cadastra um novo
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;