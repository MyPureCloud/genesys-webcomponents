import { Build as BUILD, ComponentInterface, getElement } from '@stencil/core';

declare type OnMutationDecorator = (
  target: ComponentInterface,
  propertyKey: string
) => void;

export function OnMutation(opt: MutationObserverInit): OnMutationDecorator {
  return (proto: ComponentInterface, methodName: string) => {
    // this is to resolve the 'compiler optimization issue':
    // lifecycle events not being called when not explicitly declared in at least one of components from bundle
    (BUILD as any).connectedCallback = true;
    (BUILD as any).disconnectedCallback = true;

    const { connectedCallback, disconnectedCallback } = proto;
    let onMutationObserver: MutationObserver;

    proto.connectedCallback = function () {
      const host = getElement(this);
      const method = this[methodName];

      onMutationObserver = new MutationObserver(method.bind(this));
      onMutationObserver.observe(host, opt);

      return connectedCallback && connectedCallback.call(this);
    };

    proto.disconnectedCallback = function () {
      onMutationObserver.disconnect();

      return disconnectedCallback && disconnectedCallback.call(this);
    };
  };
}
