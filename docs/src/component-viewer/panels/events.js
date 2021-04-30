import { getComponentSpec } from '../../component-specs.js';
import { emptyElement } from '../../utils/empty-element';
import { toHTML } from '../../utils/to-html.js';

const MAX_NOTIFICATION = 5;

export default class EventsPanel {
  constructor(panel, targetElement, notificationPanel) {
    this.panel = panel;
    this.targetElement = targetElement;
    this.notificationPanel = notificationPanel;
    this.descriptions = toHTML(`<dl class="event-descriptions"></dl>`);

    window.notify = this.notifyEvent.bind(this);

    panel.appendChild(this.descriptions);
  }

  updateFromTree(ast) {
    let descriptionsEl = (this.descriptions = emptyElement(this.descriptions));
    let notificationPanelEl = (this.notificationPanel = emptyElement(
      this.notificationPanel
    ));
    let components = this.traverseTree(ast);

    components.forEach(component => {
      let elements = this.targetElement.getElementsByTagName(component);
      let componentSpec = getComponentSpec(component);
      let events = componentSpec.events || [];

      Object.entries(events).forEach(([name, description]) => {
        descriptionsEl.appendChild(toHTML(`<dt>${component} [${name}]</dt>`));
        descriptionsEl.appendChild(toHTML(`<dd>${description}</dd>`));

        if (!name.startsWith('internal')) {
          for (let element of elements) {
            element.addEventListener(name, this.notifyEvent.bind(this));
          }
        }
      });
    });
  }

  notifyEvent(e) {
    let notificationPanelEl = this.notificationPanel;
    const detail = e ? e.detail : e;
    const target = e ? e.currentTarget : '';

    let currentNotifications = notificationPanelEl.children;

    while (currentNotifications.length >= MAX_NOTIFICATION) {
      currentNotifications[0].remove();
      currentNotifications = notificationPanelEl.children;
    }
    notificationPanelEl.appendChild(
      EventsPanel.getNotificationToast(
        e.type,
        detail,
        `${target.tagName.toLowerCase()}${target.id ? '#' + target.id : ''}`
      )
    );
  }

  traverseTree(root) {
    let current;
    let components = new Set();
    let queue = [root];

    while (queue.length > 0) {
      [current, ...queue] = queue;

      if (current.childNodes && current.childNodes.length > 0) {
        queue = [...queue, ...current.childNodes];
      }

      if (getComponentSpec(current.nodeName)) {
        components.add(current.nodeName);
      }
    }

    return components;
  }

  static getNotificationToast(title, detail, targetId) {
    let data;

    if (detail !== null && detail !== undefined) {
      if (typeof detail === 'object') {
        data = JSON.stringify(detail);
      } else {
        data = detail;
      }
    }

    const notification = toHTML(`
      <gux-action-toast accent="neutral">
        <gux-icon slot="icon" icon-name="alert-info" decorative></gux-icon>
        <div slot="title">${title}</div>
        <dl slot="message">
          <dt ${data ? '' : 'hidden'}>detail</dt>
          <dd ${data ? '' : 'hidden'}>${data}</dd>
          <dt>target</dt>
          <dd>${targetId}</dd>
        </dl>
      </gux-action-toast>
    `);

    setTimeout(function () {
      notification.classList.add('show');
    }, 10);

    setTimeout(function () {
      notification.remove();
    }, 5000);

    return notification;
  }
}
