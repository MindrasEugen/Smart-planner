import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './components/Layout/MainLayout.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Lazy load delle pagine per code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const AgendaPage = lazy(() => import('./pages/AgendaPage.jsx'));
const CreatePage = lazy(() => import('./pages/CreatePage.jsx'));
const AlertsPage = lazy(() => import('./pages/AlertsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const TasksPage = lazy(() => import('./pages/TasksPage.jsx'));
const FiltersPage = lazy(() => import('./pages/FiltersPage.jsx'));

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner label="Caricamento pagina..." />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/filters" element={<FiltersPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/create/task" element={<CreatePage mode="task" />} />
          <Route path="/create/birthday" element={<CreatePage mode="birthday" />} />
          <Route path="/edit/:id" element={<CreatePage mode="edit" />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
