import { Message } from "../../../../entity/types";

export interface Emits {
  (event: "send", message: Message): void;
}
