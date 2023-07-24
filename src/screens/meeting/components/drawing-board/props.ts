import { DrawingRecord } from "../../../../entity/types";

export interface Emits {
  (event: "drawing", drawingRecord: DrawingRecord): void;
}
