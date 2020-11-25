import { startOfHour } from 'date-fns';
import Appointment from '../../models/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';

interface Request {
    provider: string;    
    date: Date;
}

class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepository;
    
    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public execute({ provider, date }: Request): Appointment {
        const appointmentDate = startOfHour(date);
        const findAppointmentConflict = this.appointmentsRepository.findByDate(appointmentDate);

        if (findAppointmentConflict != null) {
            throw Error('This time is already busy');
        }

        const appointment = this.appointmentsRepository.create({
            provider,
            date: appointmentDate
        });

        return appointment;
    }
}

export default CreateAppointmentService;