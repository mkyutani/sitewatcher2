import { directoryController } from "./controller/directory.ts";
import { directoryMetadataController } from "./controller/directoryMetadata.ts";
import { Router } from "./deps.ts"
import { siteController } from "./controller/site.ts";
import { siteMetadataController } from "./controller/siteMetadata.ts";
import { siteResourceController } from "./controller/siteResource.ts";

const router = new Router();

router.post('/api/v1/directories/:id/metadata', directoryMetadataController.create);
router.get('/api/v1/directories/:id/metadata', directoryMetadataController.get);
router.delete('/api/v1/directories/:id/metadata', directoryMetadataController.delete);
router.get('/api/v1/directories/:id/sites', directoryController.getSites);
router.get('/api/v1/directories/:id/resources', directoryController.getResources);
router.post('/api/v1/directories', directoryController.create);
router.get('/api/v1/directories', directoryController.getAll);
router.get('/api/v1/directories/:id', directoryController.get);
router.put('/api/v1/directories/:id', directoryController.update);
router.delete('/api/v1/directories/:id', directoryController.delete);

router.post('/api/v1/sites/:id/metadata', siteMetadataController.create);
router.get('/api/v1/sites/:id/metadata', siteMetadataController.get);
router.delete('/api/v1/sites/:id/metadata', siteMetadataController.delete);
router.post('/api/v1/sites/:id/resources', siteResourceController.create);
router.get('/api/v1/sites/:id/resources', siteResourceController.getAll);
router.get('/api/v1/sites', siteController.getAll);
router.get('/api/v1/sites/:id', siteController.get);
router.post('/api/v1/sites', siteController.create);
router.put('/api/v1/sites/:id', siteController.update);
router.delete('/api/v1/sites/:id', siteController.delete);

export { router }