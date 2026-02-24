import { createBrowserRouter } from 'react-router';
import { Layout } from './pages/Layout';
import { GeneralOverview } from './pages/GeneralOverview';
import { ReactiveIndicators } from './pages/ReactiveIndicators';
import { ProactiveIndicators } from './pages/ProactiveIndicators';
import { Analysis } from './pages/Analysis';
import { Report } from './pages/Report';
import { KpiDefinition } from './pages/KpiDefinition';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,         Component: GeneralOverview    },
      { path: 'reactive',    Component: ReactiveIndicators },
      { path: 'proactive',   Component: ProactiveIndicators },
      { path: 'analysis',    Component: Analysis           },
      { path: 'report',      Component: Report             },
      { path: 'kpi-definition', Component: KpiDefinition   },
    ],
  },
]);
