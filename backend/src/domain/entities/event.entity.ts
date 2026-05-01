export type EventStatus = 'pending' | 'success' | 'error';

export class EventEntity {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly status: EventStatus,
    public readonly createdAt: Date,
  ) {}
}
