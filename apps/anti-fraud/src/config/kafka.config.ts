import {
  ClientProviderOptions,
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';

export const KafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'anti-fraud-consumer',
      allowAutoTopicCreation: true,
    },
  },
};

export const KafkaClientConfig: ClientProviderOptions = {
  name: 'ANTI_FRAUD',
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'anti-fraud',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'anti-fraud-consumer',
      allowAutoTopicCreation: true,
    },
  },
};
