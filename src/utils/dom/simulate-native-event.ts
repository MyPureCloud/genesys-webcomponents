export default function simulateNativeEvent(
  targetElement: HTMLElement,
  nativeEventName: 'change' | 'input'
): boolean {
  switch (nativeEventName) {
    case 'change':
      return targetElement.dispatchEvent(
        new InputEvent('change', {
          bubbles: true
        })
      );

    case 'input':
      return targetElement.dispatchEvent(
        new InputEvent('input', {
          bubbles: true
        })
      );
  }
}
