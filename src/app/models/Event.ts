import { Category } from "./Category";

export interface Event {
  id?: number;
  title?: string;
  start?: Date;
  end?: Date;
  description?: string;
  done?: boolean;
  priroty?: number;
  category?: Category;
}
