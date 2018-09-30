import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as config from 'config';
import { enableCROS } from './server-settings';
import { GSuiteRoutes } from './server-route-config';


export class GoogleSuitServer {
    app: express.Application = express();
    constructor() {
        this.settings();
        this.enableServer();
    }
    private settings() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.raw());
        this.app.use(bodyParser.json());
        this.app.use(enableCROS);
        this.serverRoutes();
    }
    private serverRoutes() {
        this.app.use("/api/drive", GSuiteRoutes());
    }
    private enableServer() {
        let port: number = config.get<number>('port');
        this.app.listen(port, '127.0.0.1', () => {
            console.log(`GSuit api listening at port ${port}.`);
        });
    }
}
new GoogleSuitServer();