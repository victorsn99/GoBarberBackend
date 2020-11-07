import 'reflect-metadata';
import User from '@modules/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/interfaces/IUsersRepository';
import IAppointmentsRepository from '../interfaces/IAppointmentsInterface';

interface Request {
    provider_id: string;
    month: number;
    year: number;
}

type Response = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListMonthAvailabilityService {
  constructor(

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository

  ){}

  public async execute({ provider_id, year, month }: Request): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month,
    });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayOfMonthArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayOfMonthArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return { day, available: appointmentsInDay.length < 10, };
    });

    return availability;
  }
}

export default ListMonthAvailabilityService;
