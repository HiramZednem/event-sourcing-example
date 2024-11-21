export interface Event {
  type: string;
  data: Record<string, any>;
  timestamp?: Date;
}
