export type EventObject<T = any> = {
  type: string;
  payload?: T;
};
