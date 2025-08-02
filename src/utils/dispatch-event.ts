const events = {
  input: null as Event | null,
  change: null as Event | null,
};

type EventName = keyof typeof events;

const update = (eventName: EventName, target: HTMLInputElement, value?: string, checked?: boolean) => {
  if (typeof checked === 'boolean' && target.checked !== checked) {
    target.click();
    return;
  }

  if (target.value === value) {
    return;
  }

  const event = (() => {
    if (events[eventName] === null) {
      events[eventName] = new Event(eventName, {
        bubbles: true,
        cancelable: true,
      });
    }

    return events[eventName];
  })();

  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(target, value);
  target.dispatchEvent(event);
};

export const dispatchInputEvent = ({
  target,
  value,
  checked,
}: {
  target: HTMLInputElement;
  value: string;
  checked?: boolean;
}) => {
  update('input', target, value, checked);
};

export const dispatchChangeEvent = ({
  target,
  value,
  checked,
}: {
  target: HTMLInputElement;
  value?: string;
  checked?: boolean;
}) => {
  update('change', target, value, checked);
};
