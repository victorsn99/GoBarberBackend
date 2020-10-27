import User from '@modules/users/infra/typeorm/entities/User';
import { differenceInHours, differenceInMilliseconds } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../interfaces/IUsersRepository';
import IUserTokensRepository from '../interfaces/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';


interface Request {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    
    @inject('UserTokensRepository')
    private usersTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
    ){}

  public async execute({token, password}: Request): Promise<void> {
    const userToken = await this.usersTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token doensnt exists');
    }

    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('User doesnt exists');
    }

    const tokenCreatedAt = userToken.created_at;

    if(differenceInHours(Date.now(), tokenCreatedAt) > 2){ //vreifica se o token foi criado e mais de duas horas. Caso seja verdade, ele será invalidado.
      throw new AppError('Token expired');
    };

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;