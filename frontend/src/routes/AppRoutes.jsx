import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

import UserList from "../pages/utilisateurs/UserList";
import UserForm from "../pages/utilisateurs/UserForm";

import ConducteurList from "../pages/conducteurs/ConducteurList";
import ConducteurForm from "../pages/conducteurs/ConducteurForm";
import ConducteurShow from "../pages/conducteurs/ConducteurShow";

import VehiculeList from "../pages/vehicules/VehiculeList";
import VehiculeForm from "../pages/vehicules/VehiculeForm";
import VehiculeShow from "../pages/vehicules/VehiculeShow";

import MissionList from "../pages/missions/MissionList";
import MissionForm from "../pages/missions/MissionForm";
import MissionShow from "../pages/missions/MissionShow";

import CarburantList from "../pages/carburants/CarburantList";
import CarburantForm from "../pages/carburants/CarburantForm";
import CarburantShow from "../pages/carburants/CarburantShow";

import AlerteList from "../pages/alertes/AlerteList";
import AlerteForm from "../pages/alertes/AlerteForm";
import AlerteShow from "../pages/alertes/AlerteShow";

import MaintenanceList from "../pages/maintenances/MaintenanceList";
import MaintenanceForm from "../pages/maintenances/MaintenanceForm";
import MaintenanceShow from "../pages/maintenances/MaintenanceShow";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Utilisateurs — Administrateur uniquement */}
            <Route path="/utilisateurs" element={<ProtectedRoute roles={["Administrateur"]}><UserList /></ProtectedRoute>} />
            <Route path="/utilisateurs/nouveau" element={<ProtectedRoute roles={["Administrateur"]}><UserForm /></ProtectedRoute>} />
            <Route path="/utilisateurs/:id/modifier" element={<ProtectedRoute roles={["Administrateur"]}><UserForm /></ProtectedRoute>} />

            {/* Conducteurs — Administrateur + Gestionnaire */}
            <Route path="/conducteurs" element={<ProtectedRoute roles={["Administrateur", "Gestionnaire"]}><ConducteurList /></ProtectedRoute>} />
            <Route path="/conducteurs/nouveau" element={<ProtectedRoute roles={["Gestionnaire"]}><ConducteurForm /></ProtectedRoute>} />
            <Route path="/conducteurs/:id" element={<ProtectedRoute roles={["Administrateur", "Gestionnaire"]}><ConducteurShow /></ProtectedRoute>} />
            <Route path="/conducteurs/:id/modifier" element={<ProtectedRoute roles={["Gestionnaire"]}><ConducteurForm /></ProtectedRoute>} />

            {/* Véhicules — lecture pour tous, écriture Gestionnaire */}
            <Route path="/vehicules" element={<ProtectedRoute><VehiculeList /></ProtectedRoute>} />
            <Route path="/vehicules/nouveau" element={<ProtectedRoute roles={["Gestionnaire"]}><VehiculeForm /></ProtectedRoute>} />
            <Route path="/vehicules/:id" element={<ProtectedRoute><VehiculeShow /></ProtectedRoute>} />
            <Route path="/vehicules/:id/modifier" element={<ProtectedRoute roles={["Gestionnaire"]}><VehiculeForm /></ProtectedRoute>} />

            {/* Missions */}
            <Route path="/missions" element={<ProtectedRoute><MissionList /></ProtectedRoute>} />
            <Route path="/missions/nouveau" element={<ProtectedRoute roles={["Gestionnaire"]}><MissionForm /></ProtectedRoute>} />
            <Route path="/missions/:id" element={<ProtectedRoute><MissionShow /></ProtectedRoute>} />

            {/* Carburants */}
            <Route path="/carburants" element={<ProtectedRoute><CarburantList /></ProtectedRoute>} />
            <Route path="/carburants/nouveau" element={<ProtectedRoute roles={["Gestionnaire", "Conducteur"]}><CarburantForm /></ProtectedRoute>} />
            <Route path="/carburants/:id" element={<ProtectedRoute><CarburantShow /></ProtectedRoute>} />

            {/* Alertes */}
            <Route path="/alertes" element={<ProtectedRoute><AlerteList /></ProtectedRoute>} />
            <Route path="/alertes/nouveau" element={<ProtectedRoute roles={["Gestionnaire", "Conducteur"]}><AlerteForm /></ProtectedRoute>} />
            <Route path="/alertes/:id" element={<ProtectedRoute><AlerteShow /></ProtectedRoute>} />

            {/* Maintenances */}
            <Route path="/maintenances" element={<ProtectedRoute><MaintenanceList /></ProtectedRoute>} />
            <Route path="/maintenances/nouveau" element={<ProtectedRoute roles={["Gestionnaire"]}><MaintenanceForm /></ProtectedRoute>} />
            <Route path="/maintenances/:id" element={<ProtectedRoute><MaintenanceShow /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
