export interface EventObject<T = any> {
  type: string;
  payload?: T;
}
