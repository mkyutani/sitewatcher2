import { channelController } from "./controller/channelController.ts";
import { siteController } from "./controller/sitesController.ts";
import { directoryController } from "./controller/directoriesController.ts";
import { Router } from "./deps.ts"
import { taskController } from "./controller/tasksController.ts";
import { directoryMetadataController } from "./controller/directoryMetadataController.ts";

const router = new Router();

router.post('/api/v1/directories/metadata', directoryMetadataController.create);
router.get('/api/v1/directories/metadata/:key', directoryMetadataController.get);
router.put('/api/v1/directories/metadata', directoryMetadataController.update);
router.delete('/api/v1/directories/metadata/:key', directoryMetadataController.delete);
router.post('/api/v1/directory-metadata/:id/metadata', directoryMetadataController.create);
router.get('/api/v1/directories/:id/metadata', directoryMetadataController.getAll);
router.get('/api/v1/directories/:id/metadata/:key', directoryMetadataController.get);
router.put('/api/v1/directories/:id/metadata', directoryMetadataController.update);
router.delete('/api/v1/directories/:id/metadata', directoryMetadataController.deleteAll);
router.delete('/api/v1/directories/:id/metadata/:key', directoryMetadataController.delete);
router.post('/api/v1/directories', directoryController.create);
router.get('/api/v1/directories', directoryController.getAll);
router.get('/api/v1/directories/:id', directoryController.get);
router.put('/api/v1/directories/:id', directoryController.update);
router.delete('/api/v1/directories/:id', directoryController.delete);

router.get('/api/v1/sites', siteController.getAll);
router.get('/api/v1/sites/:id', siteController.get);
//router.get('/api/v1/sites/:id/resources', siteController.getResources);
router.post('/api/v1/sites', siteController.create);
router.put('/api/v1/sites/:id', siteController.update);
//router.put('/api/v1/sites/:id/resources', siteController.updateResources);
router.delete('/api/v1/sites/:id', siteController.delete);
//router.delete('/api/v1/sites/:id/resources', siteController.deleteResources);

router.get('/api/v1/channels', channelController.getAll);
router.get('/api/v1/channels/:id', channelController.get);
router.post('/api/v1/channels', channelController.create);
router.put('/api/v1/channels/:id', channelController.update);
router.delete('/api/v1/channels/:id', channelController.delete);

router.get('/api/v1/tasks', taskController.getAll);
router.get('/api/v1/tasks/:id', taskController.get);
router.delete('/api/v1/tasks/:id', taskController.delete);

export { router }