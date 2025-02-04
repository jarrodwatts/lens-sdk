import { Post, FragmentPost } from '@lens-protocol/api-bindings';
import {
  mockLensCache,
  mockPostFragment,
  mockPublicationStatsFragment,
} from '@lens-protocol/api-bindings/mocks';

import { PublicationCacheManager } from '../../../transactions/adapters/PublicationCacheManager';
import { HidePublicationPresenter } from '../HidePublicationPresenter';

function setupTestScenario({ post }: { post: Post }) {
  const apolloCache = mockLensCache();

  apolloCache.writeFragment({
    id: apolloCache.identify({
      __typename: 'Post',
      id: post.id,
    }),
    fragment: FragmentPost,
    fragmentName: 'Post',
    data: post,
  });

  const publicationCacheManager = new PublicationCacheManager(apolloCache);
  const presenter = new HidePublicationPresenter(publicationCacheManager);

  return {
    presenter,

    get updatedPostFragment() {
      return apolloCache.readFragment({
        id: apolloCache.identify({
          __typename: 'Post',
          id: post.id,
        }),
        fragment: FragmentPost,
        fragmentName: 'Post',
      });
    },
  };
}

describe(`Given the ${HidePublicationPresenter.name}`, () => {
  describe(`when "${HidePublicationPresenter.prototype.present.name}" method is invoked`, () => {
    it(`should update apollo cache by flagging publication as hidden`, async () => {
      const post = mockPostFragment({
        reaction: null,
        stats: mockPublicationStatsFragment({ totalUpvotes: 1 }),
      });

      const scenario = setupTestScenario({
        post,
      });

      scenario.presenter.present(post.id);

      expect(scenario.updatedPostFragment).toEqual(
        expect.objectContaining({
          hidden: true,
        }),
      );
    });
  });
});
