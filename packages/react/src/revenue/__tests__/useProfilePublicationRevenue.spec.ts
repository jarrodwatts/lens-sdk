import { PublicationRevenue } from '@lens-protocol/api-bindings';
import {
  mockLensApolloClient,
  createGetProfilePublicationRevenueMockedResponse,
  mockPublicationRevenueFragment,
  mockSources,
  simulateAuthenticatedProfile,
  simulateNotAuthenticated,
} from '@lens-protocol/api-bindings/mocks';
import { ProfileId } from '@lens-protocol/domain/entities';
import { mockProfile, mockProfileId } from '@lens-protocol/domain/mocks';
import { waitFor } from '@testing-library/react';

import { renderHookWithMocks } from '../../__helpers__/testing-library';
import {
  useProfilePublicationRevenue,
  UseProfilePublicationRevenueArgs,
} from '../useProfilePublicationRevenue';

function setupTestScenario({
  expectedObserverId,
  result,
  ...args
}: UseProfilePublicationRevenueArgs & {
  expectedObserverId?: ProfileId;
  result: PublicationRevenue[];
}) {
  const sources = mockSources();

  return renderHookWithMocks(() => useProfilePublicationRevenue(args), {
    mocks: {
      sources,
      apolloClient: mockLensApolloClient([
        createGetProfilePublicationRevenueMockedResponse({
          variables: {
            ...args,
            observerId: expectedObserverId ?? null,
            limit: 10,
            sources,
          },
          items: result,
        }),
      ]),
    },
  });
}

describe(`Given the ${useProfilePublicationRevenue.name} hook`, () => {
  const profileId = mockProfileId();
  const revenues = [mockPublicationRevenueFragment()];
  const expectations = revenues.map(({ __typename }) => ({ __typename }));

  beforeAll(() => {
    simulateNotAuthenticated();
  });

  describe('when the query returns data successfully', () => {
    it('should return all publications with revenue', async () => {
      const { result } = setupTestScenario({ profileId, result: revenues });

      await waitFor(() => expect(result.current.loading).toBeFalsy());
      expect(result.current.data).toMatchObject(expectations);
    });
  });

  describe('when there is an Active Profile defined', () => {
    const activeProfile = mockProfile();

    beforeAll(() => {
      simulateAuthenticatedProfile(activeProfile);
    });

    it('should use the Active Profile Id as the "observerId"', async () => {
      const { result } = setupTestScenario({
        profileId,
        result: revenues,
        expectedObserverId: activeProfile.id,
      });

      await waitFor(() => expect(result.current.loading).toBeFalsy());
      expect(result.current.data).toMatchObject(expectations);
    });

    it('should always allow to specify the "observerId" on a per-call basis', async () => {
      const observerId = mockProfileId();

      const { result } = setupTestScenario({
        profileId,
        result: revenues,
        observerId,
        expectedObserverId: observerId,
      });

      await waitFor(() => expect(result.current.loading).toBeFalsy());
      expect(result.current.data).toMatchObject(expectations);
    });
  });
});
