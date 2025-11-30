import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { useMatches, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface RouteMatch {
  id: string;
  pathname: string;
  params: Record<string, string>;
  data: unknown;
  handle?: {
    title?: string;
  };
}

export default function Breadcrumb() {
  const { t } = useTranslation();

  const matches = useMatches() as RouteMatch[];

  const breadcrumbs = matches.reduce(
    (acc, match) => {
      if (
        match.handle?.title &&
        match.pathname !== '/' &&
        match.pathname !== ''
      ) {
        acc.push({
          title: match.handle?.title || '',
          path: match.pathname,
        });
      }
      return acc;
    },
    [] as { title: string; path: string }[]
  );

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <BreadcrumbUI>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={() => (
              <Link to="/dashboard">
                <Home />
              </Link>
            )}
          />
        </BreadcrumbItem>

        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={breadcrumb.path} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{t(breadcrumb.title)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link to={breadcrumb.path}>{t(breadcrumb.title)}</Link>
                    }
                  />
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbUI>
  );
}
