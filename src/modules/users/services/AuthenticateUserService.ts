import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import { compare } from 'bcryptjs'; //compara senha criptografada com não criptografada
import { sign, verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../interfaces/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
    ) {}

  public async execute({ email, password }: Request): Promise<Response>{

    const user = await this.usersRepository.findByEmail(email);

    if (!user){
      throw new AppError('Incorrect email/password', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched){
      throw new AppError('Password does not matched', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({  }, secret, {
      subject: user.id,
      expiresIn //1 dia para o token expirar
    }); //payload

    return {
      user,
      token
    };
  }
}

export default AuthenticateUserService;
