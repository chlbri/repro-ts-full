export type EventObject<T = any> = {
  type: string;
  payload?: T;
};

export type EventsMap = Record<Uppercase<string>, any>;
