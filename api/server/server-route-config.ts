import { Router } from 'express';
import { GSuiteController } from '../controller';

export function GSuiteRoutes(): Router {
    let driveRoutes: Router = Router();
    new GSuiteController(driveRoutes);
    return driveRoutes;
}