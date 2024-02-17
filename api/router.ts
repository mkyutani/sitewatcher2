import { directoryController } from "./controller/directory.ts";
import { directoryMetadataController } from "./controller/directoryMetadata.ts";
import { Router } from "./deps.ts"
import { siteController } from "./controller/site.ts";
import { siteMetadataController } from "./controller/siteMetadata.ts";
import { siteResourceController } from "./controller/siteResource.ts";

const router = new Router();

router.post('/api/v1/directories/metadata', directoryMetadataController.create);
router.get('/api/v1/directories/metadata', directoryMetadataController.get);
router.get('/api/v1/directories/metadata/:key', directoryMetadataController.get);
router.put('/api/v1/directories/metadata', directoryMetadataController.update);
router.delete('/api/v1/directories/metadata/:key', directoryMetadataController.delete);
router.post('/api/v1/directories/:id/metadata', directoryMetadataController.create);
router.get('/api/v1/directories/:id/metadata', directoryMetadataController.getAll);
router.get('/api/v1/directories/:id/metadata/:key', directoryMetadataController.get);
router.put('/api/v1/directories/:id/metadata', directoryMetadataController.update);
router.delete('/api/v1/directories/:id/metadata', directoryMetadataController.deleteAll);
router.delete('/api/v1/directories/:id/metadata/:key', directoryMetadataController.delete);
router.get('/api/v1/directories/:id/sites', directoryController.getSites);
router.post('/api/v1/directories', directoryController.create);
router.get('/api/v1/directories', directoryController.getAll);
router.get('/api/v1/directories/:id', directoryController.get);
router.put('/api/v1/directories/:id', directoryController.update);
router.delete('/api/v1/directories/:id', directoryController.delete);

router.post('/api/v1/sites/metadata', siteMetadataController.create);
router.get('/api/v1/sites/metadata', siteMetadataController.get);
router.get('/api/v1/sites/metadata/:key', siteMetadataController.get);
router.put('/api/v1/sites/metadata', siteMetadataController.update);
router.delete('/api/v1/sites/metadata/:key', siteMetadataController.delete);
router.post('/api/v1/sites/:id/metadata', siteMetadataController.create);
router.get('/api/v1/sites/:id/metadata', siteMetadataController.getAll);
router.get('/api/v1/sites/:id/metadata/:key', siteMetadataController.get);
router.put('/api/v1/sites/:id/metadata', siteMetadataController.update);
router.delete('/api/v1/sites/:id/metadata', siteMetadataController.deleteAll);
router.delete('/api/v1/sites/:id/metadata/:key', siteMetadataController.delete);
router.post('/api/v1/sites/:id/resources', siteResourceController.create);
router.get('/api/v1/sites/:id/resources', siteResourceController.getAll);
router.get('/api/v1/sites', siteController.getAll);
router.get('/api/v1/sites/:id', siteController.get);
router.post('/api/v1/sites', siteController.create);
router.put('/api/v1/sites/:id', siteController.update);
router.delete('/api/v1/sites/:id', siteController.delete);

export { router }