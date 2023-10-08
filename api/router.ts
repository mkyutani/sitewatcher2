import { channelController } from "./controller/channelController.ts";
import { siteController } from "./controller/sitesController.ts";
import { directoryController } from "./controller/directoriesController.ts";
import { Router } from "./deps.ts"
import { taskController } from "./controller/tasksController.ts";

const router = new Router();

router.get('/api/v1/directories', directoryController.getAll);
router.get('/api/v1/directories/:id', directoryController.get);
router.post('/api/v1/directories', directoryController.create);
router.put('/api/v1/directories/:id', directoryController.update);
router.delete('/api/v1/directories/:id', directoryController.delete);
router.get('/api/v1/directoryCollectors/:id', directoryController.getCollector);
router.post('/api/v1/directoryCollectors', directoryController.createCollector);
router.delete('/api/v1/directoryCollectors/:id', directoryController.deleteCollector);

router.get('/api/v1/sites', siteController.getAll);
router.get('/api/v1/sites/:id', siteController.get);
router.get('/api/v1/sites/:id/resources', siteController.getResources);
router.post('/api/v1/sites', siteController.create);
router.put('/api/v1/sites/:id', siteController.update);
router.put('/api/v1/sites/:id/resources', siteController.updateResources);
router.delete('/api/v1/sites/:id', siteController.delete);
router.delete('/api/v1/sites/:id/resources', siteController.deleteResources);

router.get('/api/v1/channels', channelController.getAll);
router.get('/api/v1/channels/:id', channelController.get);
router.post('/api/v1/channels', channelController.create);
router.put('/api/v1/channels/:id', channelController.update);
router.delete('/api/v1/channels/:id', channelController.delete);

router.get('/api/v1/tasks', taskController.getAll);
router.get('/api/v1/tasks/:id', taskController.get);
router.delete('/api/v1/tasks/:id', taskController.delete);

export { router }