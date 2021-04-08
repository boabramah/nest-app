
export default () => {

    const config = {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
        type: process.env.DATABASE_TYPE,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        url: function () {
            return process.env.DATABASE_URL || `${this.type}://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
        }
    };

    return {
        database: {
            type: config.type,
            url: config.url(),
            keepConnectionAlive: true,
            autoLoadEntities: true,
            synchronize: true,         
        }
    }
};
