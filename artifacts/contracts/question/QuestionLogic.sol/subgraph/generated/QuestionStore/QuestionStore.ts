// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class QuestionCreated extends ethereum.Event {
  get params(): QuestionCreated__Params {
    return new QuestionCreated__Params(this);
  }
}

export class QuestionCreated__Params {
  _event: QuestionCreated;

  constructor(event: QuestionCreated) {
    this._event = event;
  }

  get question(): QuestionCreatedQuestionStruct {
    return changetype<QuestionCreatedQuestionStruct>(
      this._event.parameters[0].value.toTuple()
    );
  }
}

export class QuestionCreatedQuestionStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get title(): string {
    return this[1].toString();
  }

  get body(): string {
    return this[2].toString();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get deleted(): boolean {
    return this[4].toBoolean();
  }

  get tags(): Array<Bytes> {
    return this[5].toBytesArray();
  }
}

export class QuestionDeleted extends ethereum.Event {
  get params(): QuestionDeleted__Params {
    return new QuestionDeleted__Params(this);
  }
}

export class QuestionDeleted__Params {
  _event: QuestionDeleted;

  constructor(event: QuestionDeleted) {
    this._event = event;
  }

  get question(): QuestionDeletedQuestionStruct {
    return changetype<QuestionDeletedQuestionStruct>(
      this._event.parameters[0].value.toTuple()
    );
  }
}

export class QuestionDeletedQuestionStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get title(): string {
    return this[1].toString();
  }

  get body(): string {
    return this[2].toString();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get deleted(): boolean {
    return this[4].toBoolean();
  }

  get tags(): Array<Bytes> {
    return this[5].toBytesArray();
  }
}

export class QuestionUpdated extends ethereum.Event {
  get params(): QuestionUpdated__Params {
    return new QuestionUpdated__Params(this);
  }
}

export class QuestionUpdated__Params {
  _event: QuestionUpdated;

  constructor(event: QuestionUpdated) {
    this._event = event;
  }

  get question(): QuestionUpdatedQuestionStruct {
    return changetype<QuestionUpdatedQuestionStruct>(
      this._event.parameters[0].value.toTuple()
    );
  }
}

export class QuestionUpdatedQuestionStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get title(): string {
    return this[1].toString();
  }

  get body(): string {
    return this[2].toString();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get deleted(): boolean {
    return this[4].toBoolean();
  }

  get tags(): Array<Bytes> {
    return this[5].toBytesArray();
  }
}

export class QuestionStore__createInputQuestionStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get title(): string {
    return this[1].toString();
  }

  get body(): string {
    return this[2].toString();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get deleted(): boolean {
    return this[4].toBoolean();
  }

  get tags(): Array<Bytes> {
    return this[5].toBytesArray();
  }
}

export class QuestionStore__getByIdResultValue0Struct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get title(): string {
    return this[1].toString();
  }

  get body(): string {
    return this[2].toString();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get deleted(): boolean {
    return this[4].toBoolean();
  }

  get tags(): Array<Bytes> {
    return this[5].toBytesArray();
  }
}

export class QuestionStore__getByIndexResultValue0Struct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get title(): string {
    return this[1].toString();
  }

  get body(): string {
    return this[2].toString();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get deleted(): boolean {
    return this[4].toBoolean();
  }

  get tags(): Array<Bytes> {
    return this[5].toBytesArray();
  }
}

export class QuestionStore extends ethereum.SmartContract {
  static bind(address: Address): QuestionStore {
    return new QuestionStore("QuestionStore", address);
  }

  count(): BigInt {
    let result = super.call("count", "count():(uint256)", []);

    return result[0].toBigInt();
  }

  try_count(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("count", "count():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  create(question: QuestionStore__createInputQuestionStruct): boolean {
    let result = super.call(
      "create",
      "create((bytes32,string,string,address,bool,bytes32[])):(bool)",
      [ethereum.Value.fromTuple(question)]
    );

    return result[0].toBoolean();
  }

  try_create(
    question: QuestionStore__createInputQuestionStruct
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "create",
      "create((bytes32,string,string,address,bool,bytes32[])):(bool)",
      [ethereum.Value.fromTuple(question)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  deleteById(caller: Address, id: Bytes): boolean {
    let result = super.call(
      "deleteById",
      "deleteById(address,bytes32):(bool)",
      [ethereum.Value.fromAddress(caller), ethereum.Value.fromFixedBytes(id)]
    );

    return result[0].toBoolean();
  }

  try_deleteById(caller: Address, id: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "deleteById",
      "deleteById(address,bytes32):(bool)",
      [ethereum.Value.fromAddress(caller), ethereum.Value.fromFixedBytes(id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getById(id: Bytes): QuestionStore__getByIdResultValue0Struct {
    let result = super.call(
      "getById",
      "getById(bytes32):((bytes32,string,string,address,bool,bytes32[]))",
      [ethereum.Value.fromFixedBytes(id)]
    );

    return changetype<QuestionStore__getByIdResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getById(
    id: Bytes
  ): ethereum.CallResult<QuestionStore__getByIdResultValue0Struct> {
    let result = super.tryCall(
      "getById",
      "getById(bytes32):((bytes32,string,string,address,bool,bytes32[]))",
      [ethereum.Value.fromFixedBytes(id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<QuestionStore__getByIdResultValue0Struct>(value[0].toTuple())
    );
  }

  getByIndex(index: BigInt): QuestionStore__getByIndexResultValue0Struct {
    let result = super.call(
      "getByIndex",
      "getByIndex(uint256):((bytes32,string,string,address,bool,bytes32[]))",
      [ethereum.Value.fromUnsignedBigInt(index)]
    );

    return changetype<QuestionStore__getByIndexResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getByIndex(
    index: BigInt
  ): ethereum.CallResult<QuestionStore__getByIndexResultValue0Struct> {
    let result = super.tryCall(
      "getByIndex",
      "getByIndex(uint256):((bytes32,string,string,address,bool,bytes32[]))",
      [ethereum.Value.fromUnsignedBigInt(index)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<QuestionStore__getByIndexResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  update(
    caller: Address,
    id: Bytes,
    title: string,
    body: string,
    tags: Array<Bytes>
  ): boolean {
    let result = super.call(
      "update",
      "update(address,bytes32,string,string,bytes32[]):(bool)",
      [
        ethereum.Value.fromAddress(caller),
        ethereum.Value.fromFixedBytes(id),
        ethereum.Value.fromString(title),
        ethereum.Value.fromString(body),
        ethereum.Value.fromFixedBytesArray(tags)
      ]
    );

    return result[0].toBoolean();
  }

  try_update(
    caller: Address,
    id: Bytes,
    title: string,
    body: string,
    tags: Array<Bytes>
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "update",
      "update(address,bytes32,string,string,bytes32[]):(bool)",
      [
        ethereum.Value.fromAddress(caller),
        ethereum.Value.fromFixedBytes(id),
        ethereum.Value.fromString(title),
        ethereum.Value.fromString(body),
        ethereum.Value.fromFixedBytesArray(tags)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class CreateCall extends ethereum.Call {
  get inputs(): CreateCall__Inputs {
    return new CreateCall__Inputs(this);
  }

  get outputs(): CreateCall__Outputs {
    return new CreateCall__Outputs(this);
  }
}

export class CreateCall__Inputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get question(): CreateCallQuestionStruct {
    return changetype<CreateCallQuestionStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }
}

export class CreateCall__Outputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get success(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class CreateCallQuestionStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get title(): string {
    return this[1].toString();
  }

  get body(): string {
    return this[2].toString();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get deleted(): boolean {
    return this[4].toBoolean();
  }

  get tags(): Array<Bytes> {
    return this[5].toBytesArray();
  }
}

export class DeleteByIdCall extends ethereum.Call {
  get inputs(): DeleteByIdCall__Inputs {
    return new DeleteByIdCall__Inputs(this);
  }

  get outputs(): DeleteByIdCall__Outputs {
    return new DeleteByIdCall__Outputs(this);
  }
}

export class DeleteByIdCall__Inputs {
  _call: DeleteByIdCall;

  constructor(call: DeleteByIdCall) {
    this._call = call;
  }

  get caller(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get id(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class DeleteByIdCall__Outputs {
  _call: DeleteByIdCall;

  constructor(call: DeleteByIdCall) {
    this._call = call;
  }

  get success(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpdateCall extends ethereum.Call {
  get inputs(): UpdateCall__Inputs {
    return new UpdateCall__Inputs(this);
  }

  get outputs(): UpdateCall__Outputs {
    return new UpdateCall__Outputs(this);
  }
}

export class UpdateCall__Inputs {
  _call: UpdateCall;

  constructor(call: UpdateCall) {
    this._call = call;
  }

  get caller(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get id(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get title(): string {
    return this._call.inputValues[2].value.toString();
  }

  get body(): string {
    return this._call.inputValues[3].value.toString();
  }

  get tags(): Array<Bytes> {
    return this._call.inputValues[4].value.toBytesArray();
  }
}

export class UpdateCall__Outputs {
  _call: UpdateCall;

  constructor(call: UpdateCall) {
    this._call = call;
  }

  get success(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class UpgradeLogicCall extends ethereum.Call {
  get inputs(): UpgradeLogicCall__Inputs {
    return new UpgradeLogicCall__Inputs(this);
  }

  get outputs(): UpgradeLogicCall__Outputs {
    return new UpgradeLogicCall__Outputs(this);
  }
}

export class UpgradeLogicCall__Inputs {
  _call: UpgradeLogicCall;

  constructor(call: UpgradeLogicCall) {
    this._call = call;
  }

  get _logicAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpgradeLogicCall__Outputs {
  _call: UpgradeLogicCall;

  constructor(call: UpgradeLogicCall) {
    this._call = call;
  }
}
