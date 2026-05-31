// Extends Docusaurus's built-in navbar item type registry with a conditional
// version dropdown that only renders when the visitor is inside that machine's
// docs section (checked by route prefix).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - @theme-original is a Docusaurus webpack alias; TS path not declared
import ComponentTypesOriginal from '@theme-original/NavbarItem/ComponentTypes';
import ConditionalVersionDropdown from '@site/src/components/ConditionalVersionDropdown';

export default {
  // spread all built-in types (docsVersion, docsVersionDropdown, etc.)
  ...(ComponentTypesOriginal as object),
  // custom type used in docusaurus.config.ts navbar items
  'custom-docsVersionDropdown': ConditionalVersionDropdown,
};
