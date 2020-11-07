import 'reflect-metadata';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { injectable, inject } from 'tsyringe';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '../interfaces/IAppointmentsInterface';
import { isBefore, startOfHour, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/interfaces/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';


interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {


  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    ) {}

  public async execute({ date, user_id, provider_id }: IRequest): Promise<Appointment> {

    if (user_id === provider_id) {
      throw new AppError("you can't be the user and the provider at same time")
    }

    const appointmentDate = startOfHour(date);
    
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("you can't create an appointment before 8am and after 17pm");
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("you can't create an appointment before now");
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.', 400);
    }

    const appointment = await this.appointmentsRepository.create({provider_id, user_id, date: appointmentDate});

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'ás' HH:mm 'horas.'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`
    });

    await this.cacheProvider.invalidate(`provider-appointments${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`);

    return appointment;

  }

}

export default CreateAppointmentService;
