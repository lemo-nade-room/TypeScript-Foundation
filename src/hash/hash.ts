import { Md5 } from "ts-md5";
import { isHashableObject } from "./iHashableObject";

export function hash(object: unknown): string {
  if (object == null) return Md5.hashStr("null");
  if (object instanceof Date)
    return Md5.hashStr("Date" + String(object.getTime()));
  if (isHashableObject(object)) return object.hashValue;
  return Md5.hashStr(typeof object + String(object));
}
