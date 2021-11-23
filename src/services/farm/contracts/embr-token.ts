import Service from '@/services/balancer/contracts/balancer-contracts.service';
import ConfigService from '@/services/config/config.service';
import { Multicaller } from '@/lib/utils/balancer/contract';
import { default as EmbrTokenAbi } from '@/lib/abi/EmbrToken.json';
import { getAddress } from '@ethersproject/address';
import { scale } from '@/lib/utils';
import BigNumber from 'bignumber.js';

const INITIAL_MINT = 50_000_000;

export default class EmbrToken {
  service: Service;

  constructor(service, private readonly configService = new ConfigService()) {
    this.service = service;
  }

  public async getCirculatingSupply(): Promise<number> {
    let result = {} as Record<any, any>;

    const masterChefMultiCaller = new Multicaller(
      this.configService.network.key,
      this.service.provider,
      EmbrTokenAbi
    );
    masterChefMultiCaller.call('totalSupply', this.address, 'totalSupply', []);
    result = await masterChefMultiCaller.execute(result);

    const totalSupply = result.totalSupply.toString();

    return totalSupply
      ? scale(new BigNumber(totalSupply), -18).toNumber() - INITIAL_MINT
      : 0;
  }

  public get address(): string {
    return this.service.config.addresses.embrToken || '';
  }
}
