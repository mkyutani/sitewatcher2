import { sitesController } from "./controller/sitescontroller.ts";
import { Router } from "./deps.ts"

const router = new Router();

router.get('/api/v1/sites', sitesController.getAll);
router.get('/api/v1/sites/:id', sitesController.get);
router.get('/api/v1/sites/:id/links', sitesController.getLinks);
router.post('/api/v1/sites', sitesController.create);
router.put('/api/v1/sites/:id', sitesController.update);
router.put('/api/v1/sites/:id/links', sitesController.updateLinks);
router.delete('/api/v1/sites/:id', sitesController.delete);

export { router }