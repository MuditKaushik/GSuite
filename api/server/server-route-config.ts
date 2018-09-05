import { Router } from 'express';
import { GSuiteController, GoogleAuthCallback } from '../controller';

export function GSuiteRoutes(): Router {
    let driveRoutes: Router = Router();
    new GSuiteController(driveRoutes);
    return driveRoutes;
}
export function GSuiteCallbackRoute(): Router {
    let callbackRoute: Router = Router();
    new GoogleAuthCallback(callbackRoute);
    return callbackRoute;
}