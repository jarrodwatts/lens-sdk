import { Bootstrap } from '@lens-protocol/domain/use-cases/lifecycle';
import { ActiveProfileLoader } from '@lens-protocol/domain/use-cases/profile';
import { WalletLogout } from '@lens-protocol/domain/use-cases/wallets';

import { DisableConversationsGateway } from '../../inbox';
import { SharedDependencies } from '../../shared';

export function useBootstrapController({
  activeProfileGateway,
  activeWallet,
  credentialsFactory,
  credentialsGateway,
  inboxKeyStorage,
  profileGateway,
  sessionPresenter,
  transactionQueue,
  walletGateway,
}: SharedDependencies) {
  return function () {
    const activeProfileLoader = new ActiveProfileLoader(profileGateway, activeProfileGateway);
    const conversationGateway = new DisableConversationsGateway(inboxKeyStorage);

    const walletLogout = new WalletLogout(
      walletGateway,
      credentialsGateway,
      activeWallet,
      activeProfileGateway,
      conversationGateway,
      sessionPresenter,
    );
    const bootstrap = new Bootstrap(
      activeWallet,
      credentialsGateway,
      credentialsFactory,
      activeProfileLoader,
      transactionQueue,
      sessionPresenter,
      walletLogout,
    );

    void bootstrap.execute();
  };
}
