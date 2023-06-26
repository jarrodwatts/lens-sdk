import { LogoutReason, WalletLogout } from '@lens-protocol/domain/use-cases/wallets';
import { PromiseResult, success } from '@lens-protocol/shared-kernel';

import { DisableConversationsGateway } from '../../inbox';
import { useSharedDependencies } from '../../shared';

export function useWalletLogoutController() {
  const {
    activeWallet,
    activeProfileGateway,
    credentialsGateway,
    inboxKeyStorage,
    sessionPresenter,
    walletGateway,
  } = useSharedDependencies();

  return async (reason: LogoutReason): PromiseResult<void, never> => {
    const conversationGateway = new DisableConversationsGateway(inboxKeyStorage);

    const walletLogout = new WalletLogout(
      walletGateway,
      credentialsGateway,
      activeWallet,
      activeProfileGateway,
      conversationGateway,
      sessionPresenter,
    );

    await walletLogout.logout(reason);

    return success();
  };
}
