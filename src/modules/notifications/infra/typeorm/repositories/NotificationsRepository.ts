import Notification from '../schemas/Notification';
import { getMongoRepository, MongoRepository } from 'typeorm';
import INotificationsRepository from '@modules/notifications/interfaces/INotificationsRepository';
import INotificationsDTO from '@modules/notifications/dtos/INotificationsDTO';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;
  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create ({ recipient_id, content }: INotificationsDTO): Promise<Notification> {
    const notification = this.ormRepository.create({ recipient_id, content });

    await this.ormRepository.save(notification);

    return notification;
  }

}

export default NotificationsRepository;
