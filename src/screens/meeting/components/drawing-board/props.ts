import { UserSession } from "../../../../entity/response";
import { DrawingRecord } from "../../../../entity/types";

export interface Props {
  currentShareUser: UserSession;
}

export interface Emits {
  (event: "drawing", drawingRecord: DrawingRecord): void;
}
