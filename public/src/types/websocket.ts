import { BrushShape, Paintbrush } from "./paint";

export interface DrawUpdate
  extends Omit<Paintbrush, "fillColor" | "strokeColor"> {
  prevX: number;
  prevY: number;
  text: string;
  fillColor: string;
  strokeColor: string;
}

export type LeanDrawUpdate = [
  string,
  number,
  number,
  string,
  number,
  string,
  number,
  boolean,
  boolean,
  BrushShape,
  number,
  number,
  number,
  number,
  number,
  number,
  string
];

interface Message {
  sender: string;
  message: string;
  id: string;
}

export type Messages = Message[];

export interface Connections {
  [id: string]: string;
}

export type Payload = LeanDrawUpdate | Messages | Connections;
