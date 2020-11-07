import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../interfaces/IAppointmentsInterface';

interface Request {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProvidersAppointmentService {
  constructor(

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

  ){}

  public async execute({ provider_id, day, year, month }: Request): Promise<Appointment[]> {
    const cacheKey = `provider-appointments${provider_id}:${year}-${month}-${day}`;

    console.log("CACHE KEY:", cacheKey);
    

    let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);
    
    if (!appointments) { 
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
          provider_id,
          day,
          year,
          month,
      });
      

      await this.cacheProvider.save(cacheKey, appointments);
    };

    return appointments;
  }
}

export default ListProvidersAppointmentService;
