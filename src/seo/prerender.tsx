import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppRoutes } from '../routes';

export function renderRoute(path: string): string {
  return renderToStaticMarkup(
    <StaticRouter location={path}>
      <AppRoutes />
    </StaticRouter>,
  );
}
