import {
  FeedEventItemType,
  FeedItem,
  ProfileOwnedByMeFragment,
  useFeed,
} from '@lens-protocol/react-web';
import { useEffect, useState } from 'react';

import { LoginButton, WhenLoggedInWithProfile, WhenLoggedOut } from '../components/auth';
import { ErrorMessage } from '../components/error/ErrorMessage';
import { Loading } from '../components/loading/Loading';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PublicationCard } from '../publications/components/PublicationCard';

const allFeedEventTypes = [
  FeedEventItemType.Comment,
  FeedEventItemType.Post,
  FeedEventItemType.Mirror,
  FeedEventItemType.CollectComment,
  FeedEventItemType.CollectPost,
];

type UseFeedInnerProps = {
  profile: ProfileOwnedByMeFragment;
};

let arr = [];

export const resolveFeedItemId = (feedItem: FeedItem): string => {
  const commentsKey = feedItem.comments?.map((comment) => comment.id).join(',') ?? '';
  const mirrorsKeys = feedItem.mirrors?.map((event) => event.timestamp).join(',') ?? '';
  const collectsKey = feedItem.collects?.map((event) => event.timestamp).join(',') ?? '';
  const reactionsKey = feedItem.reactions?.map((event) => event.timestamp).join(',') ?? '';
  const mirrorId = feedItem.electedMirror?.mirrorId ?? '';

  const id = [
    feedItem.root.id,
    '___',
    commentsKey,
    mirrorsKeys,
    collectsKey,
    reactionsKey,
    mirrorId,
  ].join('-');

  if (arr.includes(id)) {
    console.log('duplicate', id);
  } else {
    arr.push(id);
  }

  return id;
};

function UseFeedInner({ profile }: UseFeedInnerProps) {
  const [restrictEventTypesTo, setRestrictEventTypesTo] = useState<FeedEventItemType[]>([
    FeedEventItemType.Post,
  ]);
  const { data, error, loading, hasMore, observeRef, prev } = useInfiniteScroll(
    useFeed({
      profileId: profile.id,
    }),
  );

  useEffect(() => {
    if (data) {
      arr = [];
      data.forEach(resolveFeedItemId);
    }
  }, [data]);

  return (
    <div>
      {/*<fieldset>*/}
      {/*  <legend>Restrict event types to</legend>*/}
      {/*  {allFeedEventTypes.map((value) => (*/}
      {/*    <label key={value}>*/}
      {/*      <input*/}
      {/*        type="checkbox"*/}
      {/*        checked={restrictEventTypesTo.includes(value)}*/}
      {/*        name="restrictEventTypesTo"*/}
      {/*        value={value}*/}
      {/*        onChange={(e) => {*/}
      {/*          if (e.target.checked) {*/}
      {/*            setRestrictEventTypesTo([...restrictEventTypesTo, value]);*/}
      {/*          } else {*/}
      {/*            setRestrictEventTypesTo(restrictEventTypesTo.filter((i) => i !== value));*/}
      {/*          }*/}
      {/*        }}*/}
      {/*      />*/}
      {/*      &nbsp;{value}*/}
      {/*    </label>*/}
      {/*  ))}*/}
      {/*</fieldset>*/}

      {data?.length === 0 && <p>No items</p>}

      {loading && <Loading />}

      {error && <ErrorMessage error={error} />}

      <button disabled={loading} onClick={prev}>
        Fetch newer
      </button>

      {data?.map((item, i) => (
        <div id={`${item.root.id}-${i}`}>
          <PublicationCard key={`${item.root.id}-${i}`} publication={item.root} />
        </div>
      ))}

      {hasMore && <p ref={observeRef}>Loading more...</p>}
    </div>
  );
}

export function UseFeed() {
  return (
    <>
      <h1>
        <code>useFeed</code>
      </h1>
      <WhenLoggedInWithProfile>
        {({ profile }) => <UseFeedInner profile={profile} />}
      </WhenLoggedInWithProfile>
      <WhenLoggedOut>
        <div>
          <p>You must be logged in to use this example.</p>
          <LoginButton />
        </div>
      </WhenLoggedOut>
    </>
  );
}
