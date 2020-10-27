import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/interfaces/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;
  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    //const findAppointment = this.appointments.find(appointment => isEqual(date, appointment.date));

    const findUser = await this.ormRepository.findOne({
      where: { id },
    });

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    //const findAppointment = this.appointments.find(appointment => isEqual(date, appointment.date));

    const findUser = await this.ormRepository.findOne({
      where: { email },
    });

    return findUser;
  }

  public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = await this.ormRepository.create({ name, email, password });

    console.log('TYPEORM: ', user);

    return user;
  }

  public async save(user: User): Promise<User> {

    const userSaved = await this.ormRepository.save(user);

    return userSaved;

  }

}

export default UsersRepository;
