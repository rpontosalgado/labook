import { v4 } from "uuid";

class idGenerator {
  public generateId = (): string => v4();
}

export default new idGenerator(); 