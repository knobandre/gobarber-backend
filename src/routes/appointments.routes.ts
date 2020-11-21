import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
    const appointments = appointmentsRepository.getAll();

    return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
    const { provider, date } = request.body;

    const parsedDate = startOfHour(parseISO(date));
    const findAppointmentConflict = appointmentsRepository.findByDate(parsedDate);

    if (findAppointmentConflict != null) {
        return response.status(400).json({ message: 'This time is already busy' });
    }

    const appointment = appointmentsRepository.create(provider, parsedDate);

    return response.json(appointment);
});

export default appointmentsRouter;
