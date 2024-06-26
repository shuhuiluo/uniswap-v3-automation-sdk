import {
  ApertureSupportedChainId,
  INonfungiblePositionManager__factory,
  getAMMInfo,
} from '@/index';
import { TransactionReceipt } from '@ethersproject/providers';
import { AutomatedMarketMakerEnum } from 'aperture-lens/dist/src/viem';
import { BigNumber } from 'ethers';

import { filterLogsByEvent } from './transaction';

/**
 * Parses the specified transaction receipt and extracts the position id (token id) minted by NPM within the transaction.
 * @param chainId Chain id.
 * @param amm Automated Market Maker.
 * @param txReceipt The transaction receipt to parse.
 * @param recipientAddress The receipt address to which the position is minted.
 * @returns If a position is minted to `recipientAddress`, the position id is returned. If there is more than one, the first is returned. If there are none, `undefined` is returned.
 */
export function getMintedPositionIdFromTxReceipt(
  chainId: ApertureSupportedChainId,
  amm: AutomatedMarketMakerEnum,
  txReceipt: TransactionReceipt,
  recipientAddress: string,
): BigNumber | undefined {
  const npmAddress = getAMMInfo(
    chainId,
    amm,
  )!.nonfungiblePositionManager.toLowerCase();
  const npmInterface = INonfungiblePositionManager__factory.createInterface();
  const transferLogs = filterLogsByEvent(
    txReceipt,
    npmInterface.getEvent('Transfer'),
  );
  recipientAddress = recipientAddress.toLowerCase();
  for (const log of transferLogs) {
    if (log.address.toLowerCase() === npmAddress) {
      try {
        const event = npmInterface.parseLog(log);
        if (event.args.to.toLowerCase() === recipientAddress) {
          return event.args.tokenId;
        }
      } catch (e) {}
    }
  }
  return undefined;
}
