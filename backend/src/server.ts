import { app } from "./app";
import { MySQLDataSource } from "./config/MySQL-datasource";

const port = 3000;


; (async () => {
    try {
        await MySQLDataSource.initialize();
        console.log('Data Source has been initialized!');
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error during Data Source initialization', error);
        process.exit(1);
    }
})();