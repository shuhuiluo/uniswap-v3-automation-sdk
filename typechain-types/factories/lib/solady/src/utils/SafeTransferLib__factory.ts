/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  SafeTransferLib,
  SafeTransferLibInterface,
} from "../../../../../lib/solady/src/utils/SafeTransferLib";

const _abi = [
  {
    inputs: [],
    name: "ApproveFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ETHTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromFailed",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122078f63cbd00e075ec07c25136128b8d1549c5c9791ffb91ef2323c06a66fc835764736f6c63430008120033";

type SafeTransferLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SafeTransferLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SafeTransferLib__factory extends ContractFactory {
  constructor(...args: SafeTransferLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SafeTransferLib> {
    return super.deploy(overrides || {}) as Promise<SafeTransferLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SafeTransferLib {
    return super.attach(address) as SafeTransferLib;
  }
  override connect(signer: Signer): SafeTransferLib__factory {
    return super.connect(signer) as SafeTransferLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SafeTransferLibInterface {
    return new utils.Interface(_abi) as SafeTransferLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SafeTransferLib {
    return new Contract(address, _abi, signerOrProvider) as SafeTransferLib;
  }
}