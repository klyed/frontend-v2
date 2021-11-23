import useWeb3 from '@/services/web3/useWeb3';
import { governanceContractsService } from '@/services/governance/governance-contracts.service';
import { erc20ContractService } from '@/services/erc20/erc20-contracts.service';
import { BigNumber, utils } from 'ethers';
import { bn } from '@/lib/utils/numbers';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { default as CharredEmbrAbi } from '@/lib/abi/CharredEmbr.json';
import { MaxUint256 } from '@ethersproject/constants';

export function useGovernance() {
  const { account, getProvider } = useWeb3();

  async function fEmbrTotalSupply() {
    return utils.formatUnits(
      await governanceContractsService.cembr.getTotalCharredEmbrSupply()
    );
  }

  async function fEmbrBalance() {
    return utils.formatUnits(
      await governanceContractsService.cembr.fEmbrBalanceOf(account.value)
    );
  }

  async function totalVestedTokenAmount() {
    console.log('fetching total vested amount');
    return utils.formatUnits(
      await governanceContractsService.cembr.getTotalVestedTokenAmount()
    );
  }

  async function approveVestingToken(amount?: BigNumber) {
    await erc20ContractService.erc20.approveToken(
      getProvider(),
      governanceContractsService.cembr.cembrAddress,
      governanceContractsService.cembr.vestingTokenAddress,
      amount?.toString()
    );
  }

  async function enter(amount: BigNumber) {
    return governanceContractsService.cembr.enter(getProvider(), amount);
  }

  async function leave(amount: BigNumber) {
    return governanceContractsService.cembr.leave(getProvider(), amount);
  }

  async function exchangeRate() {
    const totalFEmbrSupply = await governanceContractsService.cembr.getTotalCharredEmbrSupply();
    const totalVestedTokens = await governanceContractsService.cembr.getTotalVestedTokenAmount();

    if (totalFEmbrSupply.eq(bn(0))) {
      return '0';
    }

    return totalVestedTokens.div(totalFEmbrSupply).toString();
  }

  // returns the amount you would get if you traded back fEmbr => vesting token
  async function exchangeAmount() {
    const totalFEmbrSupply = await governanceContractsService.cembr.getTotalCharredEmbrSupply();
    const totalVestedTokens = await governanceContractsService.cembr.getTotalVestedTokenAmount();
    const fEmbrBalance = await governanceContractsService.cembr.fEmbrBalanceOf(
      account.value
    );

    if (totalFEmbrSupply.eq(bn(0))) {
      return '0';
    }

    return utils.formatUnits(
      fEmbrBalance.mul(totalVestedTokens).div(totalFEmbrSupply)
    );
  }

  return {
    approveVestingToken,
    fEmbrTotalSupply,
    fEmbrBalance,
    totalVestedTokenAmount,
    enter,
    leave,
    exchangeAmount,
    exchangeRate
  };
}
