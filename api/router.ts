import { directoryController } from "./controller/directory.ts";
import { Router } from "./deps.ts"
import { siteController } from "./controller/site.ts";
import { channelController } from "./controller/channel.ts";
import { resourceController } from "./controller/resource.ts";

const router = new Router();

router.post('/api/v1/directories/:id/rules/:category/:weight', directoryController.createOrUpdateRule);
router.put('/api/v1/directories/:id/rules/:category/:weight', directoryController.createOrUpdateRule);
router.delete('/api/v1/directories/:id/rules/:category/:range', directoryController.deleteRule);
router.delete('/api/v1/directories/:id/rules/:category', directoryController.deleteRules);
router.post('/api/v1/directories', directoryController.create);
router.get('/api/v1/directories/:id', directoryController.get);
router.get('/api/v1/directories', directoryController.list);
router.put('/api/v1/directories/:id', directoryController.update);
router.delete('/api/v1/directories/:id', directoryController.delete);

router.post('/api/v1/sites/:id/rules/:category/:weight', siteController.createOrUpdateRule);
router.put('/api/v1/sites/:id/rules/:category/:weight', siteController.createOrUpdateRule);
router.delete('/api/v1/sites/:id/rules/:category/:range', siteController.deleteRule);
router.delete('/api/v1/sites/:id/rules/:category', siteController.deleteRules);
router.post('/api/v1/sites/:id/resources', siteController.registerResource);
router.get('/api/v1/sites/:id/resources', siteController.getAllResources);
router.put('/api/v1/sites/:id/resources', siteController.updateResource);
router.delete('/api/v1/sites/:id/resources', siteController.deleteResource);
router.post('/api/v1/sites', siteController.create);
router.get('/api/v1/sites/:id', siteController.get);
router.get('/api/v1/sites', siteController.list);
router.put('/api/v1/sites/:id', siteController.update);
router.delete('/api/v1/sites/:id', siteController.delete);

router.post('/api/v1/channels/:id/directories/:dir', channelController.addDirectory);
router.put('/api/v1/channels/:id/directories/:dir', channelController.updateDirectory);
router.delete('/api/v1/channels/:id/directories/:dir', channelController.deleteDirectory);
router.post('/api/v1/channels/:id/sites/:site', channelController.addSite);
router.put('/api/v1/channels/:id/sites/:site', channelController.updateSite);
router.delete('/api/v1/channels/:id/sites/:site', channelController.deleteSite);
router.post('/api/v1/channels/:id/devices/:dev/resources', channelController.getResourcesByDevice);
router.get('/api/v1/channels/:id/devices/:dev/resources', channelController.getResourcesByDeviceWithoutLog);
router.post('/api/v1/channels/:id/devices/:dev', channelController.addDevice);
router.put('/api/v1/channels/:id/devices/:dev', channelController.updateDevice);
router.delete('/api/v1/channels/:id/devices/:dev', channelController.deleteDevice);
router.post('/api/v1/channels/:id/resources', channelController.collectResources);
router.get('/api/v1/channels/:id/resources', channelController.getResources);
router.post('/api/v1/channels', channelController.create);
router.get('/api/v1/channels/:id', channelController.get);
router.get('/api/v1/channels', channelController.list);
router.put('/api/v1/channels/:id', channelController.update);
router.delete('/api/v1/channels/:id', channelController.delete);

router.get('/api/v1/resources/:id', resourceController.get);

export { router }