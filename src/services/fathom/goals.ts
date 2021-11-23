import ConfigService from '../config/config.service';
import { GOALS_MAP } from '@/constants/fathom';

export class Goals {
  ClickPoolsTableRow = '';
  ClickHeroConnectWallet = '';
  ClickHeroLearnMore = '';
  ClickNavConnectWallet = '';
  ClickNavTrade = '';
  ClickNavFarm = '';
  ClickNavEmbr = '';
  ClickNavCharredEmbr = '';
  ClickNavInvest = '';
  ClickNavHome = '';
  ClickNavLogo = '';
  ClickInvestSettings = '';
  ClickTradeSettings = '';
  ClickInvest = '';
  ClickFarmDeposit = '';
  ClickFarmWithdraw = '';
  ClickWithdraw = '';
  Invested = '';
  Withdrawal = '';
  ConnectedWallet = '';
  ClickSwap = '';
  Swapped = '';

  constructor(configService = new ConfigService(), goalsMap = GOALS_MAP) {
    const appNetworkGoals = goalsMap[configService.network.key];

    if (appNetworkGoals) {
      Object.keys(appNetworkGoals).forEach(key => {
        this[key] = appNetworkGoals[key];
      });
    }
  }
}
