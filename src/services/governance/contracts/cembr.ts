import Service from '@/services/balancer/contracts/balancer-contracts.service';
import ConfigService from '@/services/config/config.service';
import { call } from '@/lib/utils/balancer/contract';
import { default as CharredEmbrAbi } from '@/lib/abi/CharredEmbr.json';
import { BigNumber } from 'ethers';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { Web3Provider } from '@ethersproject/providers';

export default class CharredEmbr {
  service: Service;

  constructor(service, private readonly configService = new ConfigService()) {
    this.service = service;
  }

  public async getTotalCharredEmbrSupply(): Promise<BigNumber> {
    return await call(this.service.provider, CharredEmbrAbi, [
      this.cembrAddress,
      'totalSupply'
    ]);
  }

  public async getTotalVestedTokenAmount(): Promise<BigNumber> {
    console.log('calling');
    return await call(this.service.provider, CharredEmbrAbi, [
      this.vestingTokenAddress,
      'balanceOf',
      [this.cembrAddress]
    ]);
  }

  public async fEmbrBalanceOf(account: string): Promise<BigNumber> {
    return await call(this.service.provider, CharredEmbrAbi, [
      this.cembrAddress,
      'balanceOf',
      [account]
    ]);
  }

  public async enter(provider: Web3Provider, amount: BigNumber): Promise<void> {
    await sendTransaction(
      provider,
      this.cembrAddress,
      CharredEmbrAbi,
      'enter',
      [amount]
    );
  }

  public async leave(provider: Web3Provider, amount: BigNumber): Promise<void> {
    await sendTransaction(
      provider,
      this.cembrAddress,
      CharredEmbrAbi,
      'leave',
      [amount]
    );
  }

  public get cembrAddress(): string {
    return this.service.config.addresses.cembrToken || '';
  }
  public get vestingTokenAddress(): string {
    return this.service.config.addresses.cembrVestingToken || '';
  }
}
