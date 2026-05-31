import React from 'react';
import { useLocation } from '@docusaurus/router';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

interface Props {
  routeBasePath: string;
  docsPluginId?: string;
  dropdownItemsBefore?: React.ReactElement[];
  dropdownItemsAfter?: React.ReactElement[];
  mobile?: boolean;
  position?: 'left' | 'right';
}

export default function ConditionalVersionDropdown({ routeBasePath, ...rest }: Props): React.ReactElement | null {
  const { pathname } = useLocation();
  if (!pathname.startsWith(`/${routeBasePath}`)) {
    return null;
  }
  return (
    <DocsVersionDropdownNavbarItem
      dropdownItemsBefore={[]}
      dropdownItemsAfter={[]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(rest as any)}
    />
  );
}
