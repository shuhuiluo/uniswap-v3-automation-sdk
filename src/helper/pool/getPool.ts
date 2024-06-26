import { ApertureSupportedChainId, IUniswapV3Pool__factory } from '@/index';
import { FeeAmount, Pool } from '@aperture_finance/uniswap-v3-sdk';
import { Provider } from '@ethersproject/abstract-provider';
import { BlockTag } from '@ethersproject/providers';
import { Token } from '@uniswap/sdk-core';
import { AutomatedMarketMakerEnum } from 'aperture-lens/dist/src/viem';
import { Signer } from 'ethers';

import { computePoolAddress } from '../../utils';
import { getToken } from '../currency';
import { BasicPositionInfo } from '../position';
import { getPublicProvider } from '../provider';

/**
 * Constructs a Uniswap SDK Pool object for an existing and initialized pool.
 * Note that the constructed pool's `token0` and `token1` will be sorted, but the input `tokenA` and `tokenB` don't have to be.
 * @param tokenA One of the tokens in the pool.
 * @param tokenB The other token in the pool.
 * @param fee Fee tier of the pool.
 * @param chainId Chain id.
 * @param amm Automated Market Maker.
 * @param provider Ethers provider.
 * @param blockTag Optional block tag to query.
 * @returns The constructed Uniswap SDK Pool object.
 */
export async function getPool(
  tokenA: Token | string,
  tokenB: Token | string,
  fee: FeeAmount,
  chainId: ApertureSupportedChainId,
  amm: AutomatedMarketMakerEnum,
  provider?: Provider,
  blockTag?: BlockTag,
): Promise<Pool> {
  provider = provider ?? getPublicProvider(chainId);
  const poolContract = getPoolContract(
    tokenA,
    tokenB,
    fee,
    chainId,
    amm,
    provider,
  );
  const opts = { blockTag };
  // If the specified pool has not been created yet, then the slot0() and liquidity() calls should fail (and throw an error).
  // Also update the tokens to the canonical type.
  const [slot0, inRangeLiquidity, tokenACanon, tokenBCanon] = await Promise.all(
    [
      poolContract.slot0(opts),
      poolContract.liquidity(opts),
      getToken(
        typeof tokenA === 'string' ? tokenA : tokenA.address,
        chainId,
        provider,
        blockTag,
      ),
      getToken(
        typeof tokenB === 'string' ? tokenB : tokenB.address,
        chainId,
        provider,
        blockTag,
      ),
    ],
  );
  if (slot0.sqrtPriceX96.isZero()) {
    throw 'Pool has been created but not yet initialized';
  }
  return new Pool(
    tokenACanon,
    tokenBCanon,
    fee,
    slot0.sqrtPriceX96.toString(),
    inRangeLiquidity.toString(),
    slot0.tick,
  );
}

/**
 * Get the `IUniswapV3Pool` contract.
 */
export function getPoolContract(
  tokenA: Token | string,
  tokenB: Token | string,
  fee: FeeAmount,
  chainId: ApertureSupportedChainId,
  amm: AutomatedMarketMakerEnum,
  provider?: Provider | Signer,
) {
  return IUniswapV3Pool__factory.connect(
    computePoolAddress(chainId, amm, tokenA, tokenB, fee),
    provider ?? getPublicProvider(chainId),
  );
}

/**
 * Constructs a Uniswap SDK Pool object for the pool behind the specified position.
 * @param basicInfo Basic position info.
 * @param chainId Chain id.
 * @param amm Automated Market Maker.
 * @param provider Ethers provider.
 * @returns The constructed Uniswap SDK Pool object where the specified position resides.
 */
export async function getPoolFromBasicPositionInfo(
  basicInfo: BasicPositionInfo,
  chainId: ApertureSupportedChainId,
  amm: AutomatedMarketMakerEnum,
  provider: Provider,
): Promise<Pool> {
  return getPool(
    basicInfo.token0,
    basicInfo.token1,
    basicInfo.fee,
    chainId,
    amm,
    provider,
  );
}
