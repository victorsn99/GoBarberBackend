import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/interfaces/IAppointmentsInterface';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date));

        return findAppointment;
    }

    public async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO ): Promise<Appointment[]> {
        const findAppointments = this.appointments.filter(appointment => 
            appointment.provider_id === provider_id && 
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year);

        return findAppointments;
    }

    public async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO ): Promise<Appointment[]> {
        const findAppointments = this.appointments.filter(appointment => 
            appointment.provider_id === provider_id && 
            getDate(appointment.date) === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year);

        return findAppointments;
    }

    public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {id: uuid(), date, provider_id, user_id});

        appointment.id = uuid();
        appointment.date = date;
        appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;
    }

}

export default FakeAppointmentsRepository;
