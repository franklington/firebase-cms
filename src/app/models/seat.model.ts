
export interface Seat {
  public id: string;
  public section: number;
  public row: number;
  public seat: number;
  public userKey: string;
  public isReserved: boolean;
  public isSold: boolean;
  public isLocked: boolean;
}
