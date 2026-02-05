
import { ConfigService } from '@nestjs/config';
import { dataSourceFunction } from './datasource';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {

            const dataSource = dataSourceFunction()

            return dataSource.initialize();
        },
        inject: [ConfigService]
    },
];
