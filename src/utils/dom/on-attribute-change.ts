export function onMutation(
  element: HTMLElement | HTMLSelectElement,
  callback: (value: MutationRecord) => void
): MutationObserver {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(value => {
      callback(value);
    });
  });

  observer.observe(element, {
    attributes: true,
    childList: true,
    subtree: true
  });

  return observer;
}

export function onHiddenChange(
  element: HTMLElement | HTMLSelectElement,
  callback: (hidden: boolean) => void
): MutationObserver {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      callback(element.hidden);
    });
  });

  observer.observe(element, {
    attributes: true,
    attributeFilter: ['hidden']
  });

  return observer;
}

export function onDisabledChange(
  element: HTMLInputElement | HTMLSelectElement,
  callback: (disabled: boolean) => void
): MutationObserver {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'disabled') {
        callback(element.disabled);
      }
    });
  });

  observer.observe(element, { attributes: true });

  return observer;
}
