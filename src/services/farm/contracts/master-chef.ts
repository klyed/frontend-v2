import Service from '@/services/balancer/contracts/balancer-contracts.service';
import ConfigService from '@/services/config/config.service';
import { Multicaller } from '@/lib/utils/balancer/contract';
import { default as MasterChefAbi } from '@/lib/abi/EmbrMasterChef.json';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { scale } from '@/lib/utils';
import BigNumber from 'bignumber.js';

export default class MasterChef {
  service: Service;

  constructor(service, private readonly configService = new ConfigService()) {
    this.service = service;
  }

  public async getPendingEmbrForFarm(
    id: string,
    user: string
  ): Promise<number> {
    let result = {} as Record<any, any>;

    const masterChefMultiCaller = new Multicaller(
      this.configService.network.key,
      this.service.provider,
      MasterChefAbi
    );
    masterChefMultiCaller.call('pendingEmbr', this.address, 'pendingEmbr', [
      id,
      getAddress(user)
    ]);
    result = await masterChefMultiCaller.execute(result);

    const pendingEmbr = result.pendingEmbr.toString();

    return pendingEmbr
      ? scale(new BigNumber(pendingEmbr), -18).toNumber()
      : 0;
  }

  public async withdrawAndHarvest(
    provider: Web3Provider,
    farmId: string,
    amount: string,
    to: string
  ) {
    return sendTransaction(
      provider,
      this.configService.network.addresses.masterChef || '',
      MasterChefAbi,
      'withdrawAndHarvest',
      [farmId, amount.toString(), to]
    );
  }

  public async harvest(provider: Web3Provider, farmId: string, to: string) {
    return sendTransaction(
      provider,
      this.configService.network.addresses.masterChef || '',
      MasterChefAbi,
      'harvest',
      [farmId, to]
    );
  }

  public async harvestAll(
    provider: Web3Provider,
    farmIds: string[],
    to: string
  ) {
    return sendTransaction(
      provider,
      this.configService.network.addresses.masterChef || '',
      MasterChefAbi,
      'harvestAll',
      [farmIds, to]
    );
  }

  public async deposit(
    provider: Web3Provider,
    pid: string,
    amount: string | number,
    to: string
  ) {
    return sendTransaction(
      provider,
      this.configService.network.addresses.masterChef || '',
      MasterChefAbi,
      'deposit',
      [pid, amount.toString(), to]
    );
    // masterChefMultiCaller.call('deposit', this.address, 'deposit', [
    //   pid,
    //   amount.toString(),
    //   to
    // ]);
    // await masterChefMultiCaller.execute();
  }

  public get address(): string {
    return this.service.config.addresses.masterChef || '';
  }
}
