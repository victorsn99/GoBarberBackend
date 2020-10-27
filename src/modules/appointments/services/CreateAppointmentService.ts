import 'reflect-metadata';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { injectable, inject } from 'tsyringe';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '../interfaces/IAppointmentsInterface';
import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';


interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {


  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
    ) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.', 400);
    }

    const appointment = await this.appointmentsRepository.create({provider_id, date: appointmentDate});

    return appointment;

  }

}

export default CreateAppointmentService;
