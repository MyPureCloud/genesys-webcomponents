import simulateNativeEvent from './simulate-native-event';

export default function setInputValue(
  input: HTMLInputElement,
  value: string,
  focusAfter: boolean
): void {
  input.value = value;

  simulateNativeEvent(input, 'input');
  simulateNativeEvent(input, 'change');

  if (focusAfter) {
    input.focus();
  }
}
