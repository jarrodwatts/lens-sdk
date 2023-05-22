import {
  ConversationsEnabled,
  useConversations,
  useEnableConversations,
} from '@lens-protocol/react-web';
import { Link } from 'react-router-dom';

import { LoginButton, WhenLoggedInWithProfile, WhenLoggedOut } from '../components/auth';
import { ErrorMessage } from '../components/error/ErrorMessage';
import { Loading } from '../components/loading/Loading';
import { ConversationCard } from './components/ConversationCard';

type UseConversationsInnerProps = {
  inbox: ConversationsEnabled;
};

function UseConversationsInner({ inbox }: UseConversationsInnerProps) {
  const { data, loading, error } = useConversations(inbox);

  return (
    <div>
      {data?.length === 0 && <p>No items</p>}

      {loading && <Loading />}

      {error && <ErrorMessage error={error} />}

      {data?.map((conversation) => (
        <ConversationCard conversation={conversation} key={conversation.id}>
          <Link to={`/inbox/useConversation/${encodeURIComponent(conversation.id)}`}>
            Show details
          </Link>
        </ConversationCard>
      ))}
    </div>
  );
}

function EnableConversations() {
  const { execute: enableConversations, isPending, data: inbox, error } = useEnableConversations();

  const onEnableClick = async () => {
    await enableConversations();
  };

  return (
    <div>
      {!inbox && (
        <button onClick={onEnableClick} disabled={isPending}>
          Enable Inbox
        </button>
      )}

      {isPending && <Loading />}

      {error && <ErrorMessage error={error} />}

      {inbox && <UseConversationsInner inbox={inbox} />}
    </div>
  );
}

export function UseConversations() {
  return (
    <>
      <h1>
        <code>useConversations</code>
      </h1>
      <WhenLoggedInWithProfile>{() => <EnableConversations />}</WhenLoggedInWithProfile>
      <WhenLoggedOut>
        <div>
          <p>You must be logged in to use this example.</p>
          <LoginButton />
        </div>
      </WhenLoggedOut>
    </>
  );
}
