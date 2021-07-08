import IntlMessageFormat from 'intl-messageformat';
import { fetchResources, ILocalizedComponentResources } from './fetchResources';
// If this import is failing, you should run the i18n script to generate the list of locales
import locales from './locales.json';
import startOfWeekData from './start-of-week.json';
import { getClosestElement } from '../utils/dom/get-closest-element';

export type GetI18nValue = (resourceKey: string, context?: any) => string;

const DEFAULT_LOCALE = 'en';

export async function buildI18nForComponent(
  component: HTMLElement,
  defaultResources: ILocalizedComponentResources
): Promise<GetI18nValue> {
  let resources = defaultResources;
  let locale = 'en';

  if (component !== undefined) {
    locale = getDesiredLocale(component);
    resources = await getComponentI18nResources(
      component,
      defaultResources,
      locale
    );
  }

  const intlFormats = Object.entries(resources).reduce((map, [key, val]) => {
    map.set(key, new IntlMessageFormat(val, locale));
    return map;
  }, new Map<string, IntlMessageFormat>());

  return (resourceKey: string, context?: any): string =>
    intlFormats.get(resourceKey).format(context) as string;
}

export async function getComponentI18nResources(
  component: HTMLElement,
  defaultResources: ILocalizedComponentResources,
  locale: string
): Promise<ILocalizedComponentResources> {
  const componentName = component.tagName
    .toLocaleLowerCase()
    .replace(/-beta$/, '');

  let resources: ILocalizedComponentResources;
  if (component['i18n-resources']) {
    resources = component['i18n-resources'];
  } else if (locale !== DEFAULT_LOCALE) {
    try {
      resources = await fetchResources(componentName, locale);
    } catch (_) {
      resources = null;
    }
  }

  if (!resources) {
    resources = defaultResources;
  }

  return resources;
}

export function getDesiredLocale(element: HTMLElement): string {
  const locale = findLocaleInDom(element);
  const lang = locale.split(/[_-]/)[0];

  if (locales.indexOf(locale) >= 0) {
    return locale;
  } else if (locales.indexOf(lang) >= 0) {
    return lang;
  } else {
    console.error(
      `gux: No translation locale found for ${locale}, defaulting to '${DEFAULT_LOCALE}'`
    );
    return DEFAULT_LOCALE;
  }
}

function findLocaleInDom(element: HTMLElement): string {
  const closestElement = getClosestElement('[lang]', element) as HTMLElement;

  if (closestElement && closestElement.lang) {
    return closestElement.lang.toLowerCase();
  } else {
    console.error(
      `gux: No language specified on page, defaulting to '${DEFAULT_LOCALE}'`
    );
    return DEFAULT_LOCALE;
  }
}

export function getStartOfWeek(locale: string = DEFAULT_LOCALE): number {
  return startOfWeekData[locale]
    ? startOfWeekData[locale]
    : startOfWeekData[DEFAULT_LOCALE];
}
