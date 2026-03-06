import React from 'react';
import { Link } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs component with visual navigation and structured data
 * Automatically includes Home as first item
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const { language } = useApp();
  
  const homeItem = {
    label: language === 'es' ? 'Inicio' : 'Home',
    href: `/${language}`,
  };

  const allItems = [homeItem, ...items];

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        
        return (
          <React.Fragment key={index}>
            {index === 0 ? (
              <Link 
                to={item.href || '/'} 
                className="flex items-center hover:text-capybara-orange transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {isLast || !item.href ? (
                  <span className="text-gray-800 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    to={item.href} 
                    className="hover:text-capybara-orange transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
