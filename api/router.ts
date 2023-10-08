import { channelController } from "./controller/channelController.ts";
import { sitesController } from "./controller/sitesController.ts";
import { directoriesController } from "./controller/directoriesController.ts";
import { Router } from "./deps.ts"

const router = new Router();

router.get('/api/v1/directories', directoriesController.getAll);
router.get('/api/v1/directories/:id', directoriesController.get);
router.post('/api/v1/directories', directoriesController.create);
router.put('/api/v1/directories/:id', directoriesController.update);
router.delete('/api/v1/directories/:id', directoriesController.delete);

router.get('/api/v1/sites', sitesController.getAll);
router.get('/api/v1/sites/:id', sitesController.get);
router.get('/api/v1/sites/:id/resources', sitesController.getResources);
router.post('/api/v1/sites', sitesController.create);
router.put('/api/v1/sites/:id', sitesController.update);
router.put('/api/v1/sites/:id/resources', sitesController.updateResources);
router.delete('/api/v1/sites/:id', sitesController.delete);
router.delete('/api/v1/sites/:id/resources', sitesController.deleteResources);

router.get('/api/v1/channels', channelController.getAll);
router.get('/api/v1/channels/:id', channelController.get);
router.post('/api/v1/channels', channelController.create);
router.put('/api/v1/channels/:id', channelController.update);
router.delete('/api/v1/channels/:id', channelController.delete);

export { router }