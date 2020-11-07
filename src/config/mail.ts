interface IMailConfig {
    driver: 'ethereal' | 'ses';
    defaults: {
        from: {
            email: string;
            name: string;
        }
    };
}

export default {
    driver: process.env.APP_EMAIL_SERVICE || 'ethereal',

    defaults: {
        from: {
            email: 'jacknoia9931@gmail.com',
            name: 'GoBarber App Teste'
        }
    }
} as IMailConfig;