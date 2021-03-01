import {
  Component,
  Element,
  getAssetPath,
  h,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

const svgHTMLCache: Map<string, Promise<string>> = new Map();

@Component({
  assetsDirs: ['icons'],
  styleUrl: 'gux-icon.less',
  tag: 'gux-icon'
})
export class GuxIcon {
  @Element()
  private root: HTMLElement;

  /**
   * Indicate which icon to display
   */
  @Prop()
  iconName: string;

  /**
   * Indicate whether the icon should be ignored by accessibility tools or not
   */
  @Prop()
  decorative: boolean = false;

  /**
   * Localized text describing the intent of this icon (not required if `decorative=true`)
   */
  @Prop()
  screenreaderText: string = '';

  @State()
  private svgHtml?: string;

  @Watch('iconName')
  async prepIcon(iconName: string) {
    if (iconName) {
      this.svgHtml = await this.loadSvgData(iconName);
    }
  }

  async componentWillLoad() {
    trackComponent(this.root, { variant: this.iconName });
    await this.prepIcon(this.iconName);
  }

  componentDidLoad() {
    if (!this.decorative && !this.screenreaderText) {
      throw new Error(
        '[gux-icon] No screenreader-text provided. Either provide a localized screenreader-text property or set `decorative` to true'
      );
    }
  }

  render() {
    return (
      this.svgHtml && (
        <div class="gux-icon-container" innerHTML={this.svgHtml}></div>
      )
    );
  }

  private loadSvgData(iconName: string): Promise<string> {
    const id = `${iconName}-${this.decorative}-${this.screenreaderText}`;
    const cachedSvgElement = svgHTMLCache.get(id);

    if (cachedSvgElement) {
      return cachedSvgElement;
    }

    const iconUrl = getAssetPath(`./icons/${this.iconName}.svg`);
    const getSvgHtml = fetch(iconUrl)
      .then(response => {
        if (response.status === 200) {
          return response.text();
        }
        throw new Error(
          `[gux-icon] fetching failed for icon "${this.iconName}" with status "${response.statusText} (${response.status})".`
        );
      })
      .then(svgText => {
        const svgElement = new DOMParser().parseFromString(
          svgText,
          'image/svg+xml'
        ).firstChild as SVGElement;

        if (this.decorative) {
          svgElement.setAttribute('aria-hidden', String(this.decorative));
        }

        if (this.screenreaderText) {
          svgElement.setAttribute('aria-label', this.screenreaderText);
        }

        return svgElement.outerHTML;
      })
      .catch(err => {
        setTimeout(() => {
          throw err;
        }, 0);
        return null;
      });

    svgHTMLCache.set(id, getSvgHtml);

    return getSvgHtml;
  }
}
