import connectGeoSearch from 'instantsearch.js/es/connectors/geo-search/connectGeoSearch';

import { useConnector } from '../hooks/useConnector';

import type { AdditionalWidgetProperties } from '../hooks/useConnector';
import type { GeoHit } from 'instantsearch.js';
import type {
  GeoSearchConnector,
  GeoSearchConnectorParams,
  GeoSearchWidgetDescription,
} from 'instantsearch.js/es/connectors/geo-search/connectGeoSearch';

export type UseGeoSearchProps<THit extends GeoHit = GeoHit> =
  GeoSearchConnectorParams<THit>;

export function useGeoSearch<THit extends GeoHit>(
  props?: UseGeoSearchProps<THit>,
  additionalWidgetProperties?: AdditionalWidgetProperties
) {
  return useConnector<
    GeoSearchConnectorParams<THit>,
    GeoSearchWidgetDescription<THit>
  >(
    connectGeoSearch as GeoSearchConnector<THit>,
    props,
    additionalWidgetProperties
  );
}
