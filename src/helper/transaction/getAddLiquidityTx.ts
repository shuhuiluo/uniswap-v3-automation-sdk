import { ApertureSupportedChainId, getAMMInfo } from '@/index';
import {
  IncreaseOptions,
  NonfungiblePositionManager,
  Position,
} from '@aperture_finance/uniswap-v3-sdk';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import { BigintIsh } from '@uniswap/sdk-core';
import { AutomatedMarketMakerEnum } from 'aperture-lens/dist/src/viem';

import { PositionDetails } from '../position';
import { getTxToNonfungiblePositionManager } from './transaction';

/**
 * Generates an unsigned transaction that adds liquidity to an existing position.
 * Note that if the position involves ETH and the user wishes to provide native ether instead of WETH, then
 * `increaseLiquidityOptions.useNative` should be set to `getNativeEther(chainId)`.
 * @param increaseLiquidityOptions Increase liquidity options.
 * @param chainId Chain id.
 * @param amm Automated Market Maker.
 * @param provider Ethers provider.
 * @param liquidityToAdd The amount of liquidity to add to the existing position.
 * @param position Uniswap SDK Position object for the specified position (optional); if undefined, one will be created.
 * @returns The unsigned tx.
 */
export async function getAddLiquidityTx(
  increaseLiquidityOptions: IncreaseOptions,
  chainId: ApertureSupportedChainId,
  amm: AutomatedMarketMakerEnum,
  provider: Provider,
  liquidityToAdd: BigintIsh,
  position?: Position,
): Promise<TransactionRequest> {
  if (position === undefined) {
    ({ position } = await PositionDetails.fromPositionId(
      chainId,
      amm,
      increaseLiquidityOptions.tokenId.toString(),
      provider,
    ));
  }
  // Same as `position` except that the liquidity field represents the amount of liquidity to add to the existing `position`.
  const incrementalPosition = new Position({
    pool: position.pool,
    liquidity: liquidityToAdd,
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
  });
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    incrementalPosition,
    increaseLiquidityOptions,
  );
  return getTxToNonfungiblePositionManager(
    getAMMInfo(chainId, amm)!,
    calldata,
    value,
  );
}
