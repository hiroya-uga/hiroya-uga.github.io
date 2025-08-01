const events = {
  input: null as Event | null,
  change: null as Event | null,
};

type EventName = keyof typeof events;

const update = (eventName: EventName, target: HTMLInputElement, value: string) => {
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

export const dispatchInputEvent = ({ target, value }: { target: HTMLInputElement; value: string }) => {
  update('input', target, value);
};

export const dispatchChangeEvent = ({ target, value }: { target: HTMLInputElement; value: string }) => {
  update('change', target, value);
};
