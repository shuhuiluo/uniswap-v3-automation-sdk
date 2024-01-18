import { UniV3Automan__factory } from '@/index';
import {
  AbiStateMutability,
  ContractFunctionArgs,
  ContractFunctionReturnType,
} from 'viem';

import { GetAbiFunctionParamsTypes } from '../generics';

export type AutomanActionName =
  | 'mintOptimal'
  | 'decreaseLiquidity'
  | 'reinvest'
  | 'rebalance'
  | 'removeLiquidity';

export type GetAutomanParams<T extends AutomanActionName> =
  GetAbiFunctionParamsTypes<typeof UniV3Automan__factory.abi, T>;

export type GetAutomanReturnTypes<
  functionName extends AutomanActionName,
  args extends ContractFunctionArgs<
    typeof UniV3Automan__factory.abi,
    AbiStateMutability,
    functionName
  > = ContractFunctionArgs<
    typeof UniV3Automan__factory.abi,
    AbiStateMutability,
    functionName
  >,
> = ContractFunctionReturnType<
  typeof UniV3Automan__factory.abi,
  AbiStateMutability,
  functionName,
  args // to dedup function name
>;