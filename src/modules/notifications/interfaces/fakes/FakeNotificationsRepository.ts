import { getMongoRepository, MongoRepository } from 'typeorm';
import INotificationsRepository from '@modules/notifications/interfaces/INotificationsRepository';
import INotificationsDTO from '@modules/notifications/dtos/INotificationsDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';

class NotificationsRepository implements INotificationsRepository {
    private notifications: Notification[] = [];

  public async create ({ recipient_id, content }: INotificationsDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID() ,content, recipient_id })

    this.notifications.push(notification);

    return notification;
  }

}

export default NotificationsRepository;
