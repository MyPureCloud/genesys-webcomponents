import {
  Component,
  Element,
  h,
  JSX,
  Prop,
  Event,
  EventEmitter
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import {
  GuxButtonAccent,
  GuxDismissButtonType
} from './gux-dismiss-button.types';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';

@Component({
  styleUrl: 'gux-dismiss-button.less',
  tag: 'gux-dismiss-button'
})
export class GuxDismissButton {
  private i18n: GetI18nValue;

  @Element()
  private root: HTMLElement;

  /**
   * The component button type
   */
  @Prop()
  type: GuxDismissButtonType = 'button';

  // @Prop()
  // dismiss: Function;
  //
  // @Prop()
  // parentObj: Object;

  /**
   * Triggered when the dismiss button is pushed.
   */
  @Event()
  dismissEvent: EventEmitter<string>;

  emitDismiss() {
    // console.log("dismiss");
    this.dismissEvent.emit('dismiss');
  }

  componentWillLoad() {
    trackComponent(this.root, { variant: 'dismiss' });
    // this.emitDismiss.on('dismiss', function() {console.log("hey");});
    // this.makeSlotContentDisableable();
  }

  render(): JSX.Element {
    return (
      <button
        class="gux-dismiss"
        type="button"
        // title={this.i18n('dismiss')}
        onClick={this.emitDismiss.bind(this)}
      >
        <gux-icon
          icon-name="close"
          // screenreader-text={this.i18n('dismiss')}
        ></gux-icon>
      </button>
    );
  }
}
