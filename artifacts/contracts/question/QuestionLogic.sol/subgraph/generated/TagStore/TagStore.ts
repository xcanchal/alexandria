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

export class TagCreated extends ethereum.Event {
  get params(): TagCreated__Params {
    return new TagCreated__Params(this);
  }
}

export class TagCreated__Params {
  _event: TagCreated;

  constructor(event: TagCreated) {
    this._event = event;
  }

  get tag(): TagCreatedTagStruct {
    return changetype<TagCreatedTagStruct>(
      this._event.parameters[0].value.toTuple()
    );
  }
}

export class TagCreatedTagStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get deleted(): boolean {
    return this[3].toBoolean();
  }

  get creator(): Address {
    return this[4].toAddress();
  }
}

export class TagDeleted extends ethereum.Event {
  get params(): TagDeleted__Params {
    return new TagDeleted__Params(this);
  }
}

export class TagDeleted__Params {
  _event: TagDeleted;

  constructor(event: TagDeleted) {
    this._event = event;
  }

  get tag(): TagDeletedTagStruct {
    return changetype<TagDeletedTagStruct>(
      this._event.parameters[0].value.toTuple()
    );
  }
}

export class TagDeletedTagStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get deleted(): boolean {
    return this[3].toBoolean();
  }

  get creator(): Address {
    return this[4].toAddress();
  }
}

export class TagUpdated extends ethereum.Event {
  get params(): TagUpdated__Params {
    return new TagUpdated__Params(this);
  }
}

export class TagUpdated__Params {
  _event: TagUpdated;

  constructor(event: TagUpdated) {
    this._event = event;
  }

  get tag(): TagUpdatedTagStruct {
    return changetype<TagUpdatedTagStruct>(
      this._event.parameters[0].value.toTuple()
    );
  }
}

export class TagUpdatedTagStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get deleted(): boolean {
    return this[3].toBoolean();
  }

  get creator(): Address {
    return this[4].toAddress();
  }
}

export class TagStore__createInputTagStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get deleted(): boolean {
    return this[3].toBoolean();
  }

  get creator(): Address {
    return this[4].toAddress();
  }
}

export class TagStore__getByIdResultValue0Struct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get deleted(): boolean {
    return this[3].toBoolean();
  }

  get creator(): Address {
    return this[4].toAddress();
  }
}

export class TagStore__getByIndexResultValue0Struct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get deleted(): boolean {
    return this[3].toBoolean();
  }

  get creator(): Address {
    return this[4].toAddress();
  }
}

export class TagStore extends ethereum.SmartContract {
  static bind(address: Address): TagStore {
    return new TagStore("TagStore", address);
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

  create(tag: TagStore__createInputTagStruct): boolean {
    let result = super.call(
      "create",
      "create((bytes32,string,string,bool,address)):(bool)",
      [ethereum.Value.fromTuple(tag)]
    );

    return result[0].toBoolean();
  }

  try_create(
    tag: TagStore__createInputTagStruct
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "create",
      "create((bytes32,string,string,bool,address)):(bool)",
      [ethereum.Value.fromTuple(tag)]
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

  getById(id: Bytes): TagStore__getByIdResultValue0Struct {
    let result = super.call(
      "getById",
      "getById(bytes32):((bytes32,string,string,bool,address))",
      [ethereum.Value.fromFixedBytes(id)]
    );

    return changetype<TagStore__getByIdResultValue0Struct>(result[0].toTuple());
  }

  try_getById(
    id: Bytes
  ): ethereum.CallResult<TagStore__getByIdResultValue0Struct> {
    let result = super.tryCall(
      "getById",
      "getById(bytes32):((bytes32,string,string,bool,address))",
      [ethereum.Value.fromFixedBytes(id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<TagStore__getByIdResultValue0Struct>(value[0].toTuple())
    );
  }

  getByIndex(index: BigInt): TagStore__getByIndexResultValue0Struct {
    let result = super.call(
      "getByIndex",
      "getByIndex(uint256):((bytes32,string,string,bool,address))",
      [ethereum.Value.fromUnsignedBigInt(index)]
    );

    return changetype<TagStore__getByIndexResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getByIndex(
    index: BigInt
  ): ethereum.CallResult<TagStore__getByIndexResultValue0Struct> {
    let result = super.tryCall(
      "getByIndex",
      "getByIndex(uint256):((bytes32,string,string,bool,address))",
      [ethereum.Value.fromUnsignedBigInt(index)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<TagStore__getByIndexResultValue0Struct>(value[0].toTuple())
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

  updateDescription(caller: Address, id: Bytes, description: string): boolean {
    let result = super.call(
      "updateDescription",
      "updateDescription(address,bytes32,string):(bool)",
      [
        ethereum.Value.fromAddress(caller),
        ethereum.Value.fromFixedBytes(id),
        ethereum.Value.fromString(description)
      ]
    );

    return result[0].toBoolean();
  }

  try_updateDescription(
    caller: Address,
    id: Bytes,
    description: string
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "updateDescription",
      "updateDescription(address,bytes32,string):(bool)",
      [
        ethereum.Value.fromAddress(caller),
        ethereum.Value.fromFixedBytes(id),
        ethereum.Value.fromString(description)
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

  get tag(): CreateCallTagStruct {
    return changetype<CreateCallTagStruct>(
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

export class CreateCallTagStruct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get name(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get deleted(): boolean {
    return this[3].toBoolean();
  }

  get creator(): Address {
    return this[4].toAddress();
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

export class UpdateDescriptionCall extends ethereum.Call {
  get inputs(): UpdateDescriptionCall__Inputs {
    return new UpdateDescriptionCall__Inputs(this);
  }

  get outputs(): UpdateDescriptionCall__Outputs {
    return new UpdateDescriptionCall__Outputs(this);
  }
}

export class UpdateDescriptionCall__Inputs {
  _call: UpdateDescriptionCall;

  constructor(call: UpdateDescriptionCall) {
    this._call = call;
  }

  get caller(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get id(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get description(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class UpdateDescriptionCall__Outputs {
  _call: UpdateDescriptionCall;

  constructor(call: UpdateDescriptionCall) {
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