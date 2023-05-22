import { Wallet } from '@lens-protocol/domain/entities';
import {
  GetAllConversationsRequest,
  GetAllConversationsResult,
  IGetAllConversationsGateway,
} from '@lens-protocol/domain/use-cases/inbox';

import { IConversationProvider } from './IConversationProvider';

export class GetAllConversationsGateway implements IGetAllConversationsGateway {
  constructor(private readonly provider: IConversationProvider) {}

  async fetchConversationsWithLastMessage(
    wallet: Wallet,
    request: GetAllConversationsRequest,
  ): Promise<GetAllConversationsResult> {
    return this.provider.fetchConversations({
      participant: {
        profileId: request.profileId,
        address: wallet.address,
      },
    });
  }
}
