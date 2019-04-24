/*!
 * This source file is part of the EdgeDB open source project.
 *
 * Copyright 2019-present MagicStack Inc. and the EdgeDB authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ReadBuffer, WriteBuffer} from "../buffer";
import {ICodec, uuid} from "./ifaces";

export class BoolCodec implements ICodec {
  readonly tid: uuid;
  readonly tidBuffer: Buffer;
  readonly isScalar = true;

  constructor(tid: uuid) {
    this.tid = tid;
    this.tidBuffer = Buffer.from(tid, "hex");
  }

  encode(buf: WriteBuffer, object: any): void {
    buf.writeInt32(1);
    buf.writeChar(object ? 1 : 0);
  }

  decode(buf: ReadBuffer): any {
    return buf.readUInt8() !== 0;
  }
}
