import { createResourceService } from "./resource";

export const userService = createResourceService("users");
export const conducteurService = createResourceService("conducteurs");
export const vehiculeService = createResourceService("vehicules");
export const missionService = createResourceService("missions");
export const carburantService = createResourceService("carburants");
export const alerteService = createResourceService("alertes");
export const maintenanceService = createResourceService("maintenances");
