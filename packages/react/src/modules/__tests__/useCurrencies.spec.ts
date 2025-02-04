import {
  mockLensApolloClient,
  mockEnabledModuleCurrenciesResponse,
} from '@lens-protocol/api-bindings/mocks';
import { ChainType } from '@lens-protocol/shared-kernel';
import { mockDaiAsset, mockUsdcAsset } from '@lens-protocol/shared-kernel/mocks';
import { waitFor } from '@testing-library/react';

import { renderHookWithMocks } from '../../__helpers__/testing-library';
import { useCurrencies } from '../useCurrencies';

describe(`Given the ${useCurrencies.name} hook`, () => {
  describe('when invoked', () => {
    it(`should return the expected list of Erc20`, async () => {
      const chainType = ChainType.POLYGON;
      const currencies = [mockDaiAsset({ chainType }), mockUsdcAsset({ chainType })];
      const { result } = renderHookWithMocks(() => useCurrencies(), {
        mocks: {
          apolloClient: mockLensApolloClient([mockEnabledModuleCurrenciesResponse(currencies)]),
        },
      });

      await waitFor(() => expect(result.current.loading).toBeFalsy());

      expect(result.current.data).toEqual(currencies);
    });
  });
});
