import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/interfaces/IAppointmentsInterface';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;
  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    //const findAppointment = this.appointments.find(appointment => isEqual(date, appointment.date));

    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO ): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0'); //colocar um zero a esquerda para salvar no banco e não gerar conflito com o método RAW

    const findAppointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName => 
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'` 
        ),
      },
    });

    return findAppointments;
  }

  public async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO ): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, "0"); //colocar um zero a esquerda para salvar no banco e não gerar conflito com o método RAW
    const parsedDay = String(day).padStart(2, "0");

    const findAppointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName => 
          `TO_CHAR(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
           
        ),
        
      },
    });
    console.log("PROVIDER ID: ", provider_id);
    console.log("DATE FIELD NAME: ", findAppointments);
    console.log("PARSED DATE: ", parsedDay);
    console.log("PARSED MONTH: ", parsedMonth);
    console.log("YEAR: ", year);

    return findAppointments;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }

}

export default AppointmentsRepository;
