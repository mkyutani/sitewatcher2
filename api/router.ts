import { directoryController } from "./controller/directory.ts";
import { directoryMetadataController } from "./controller/directoryMetadata.ts";
import { Router } from "./deps.ts"
import { siteController } from "./controller/site.ts";
import { siteMetadataController } from "./controller/siteMetadata.ts";
import { channelController } from "./controller/channel.ts";

const router = new Router();

router.post('/api/v1/directories/:id/metadata', directoryMetadataController.create);
router.get('/api/v1/directories/:id/metadata', directoryMetadataController.get);
router.delete('/api/v1/directories/:id/metadata', directoryMetadataController.delete);
router.get('/api/v1/directories/:id/resources', directoryController.getResources);
router.post('/api/v1/directories', directoryController.create);
router.get('/api/v1/directories/:id', directoryController.get);
router.get('/api/v1/directories', directoryController.list);
router.put('/api/v1/directories/:id', directoryController.update);
router.delete('/api/v1/directories/:id', directoryController.delete);

router.post('/api/v1/sites/:id/metadata', siteMetadataController.create);
router.get('/api/v1/sites/:id/metadata', siteMetadataController.get);
router.delete('/api/v1/sites/:id/metadata', siteMetadataController.delete);
router.post('/api/v1/sites/:id/resources', siteController.registerResource);
router.get('/api/v1/sites/:id/resources', siteController.getAllResources);
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
router.post('/api/v1/channels/:id/devices/:dev', channelController.addDevice);
router.put('/api/v1/channels/:id/devices/:dev', channelController.updateDevice);
router.delete('/api/v1/channels/:id/devices/:dev', channelController.deleteDevice);
/*
router.post('/api/v1/channels/:id/collect', channelController.collect);
*/
router.post('/api/v1/channels', channelController.create);
router.get('/api/v1/channels/:id', channelController.get);
router.get('/api/v1/channels', channelController.list);
router.put('/api/v1/channels/:id', channelController.update);
router.delete('/api/v1/channels/:id', channelController.delete);

export { router }