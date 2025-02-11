import React, { useEffect, useState } from 'react';
import { FaGear } from 'react-icons/fa6';
import { useContent, useLookup } from 'store/hooks';
import { Button, ButtonHeight, ContentTypeName, IFilterSettingsModel } from 'tno-core';

import { HomeFilterType } from '../constants';
import * as styled from './styled';

export interface IHomeFilterProps {}

/**
 * Component that renders the toggle buttons for filtering content on the Home page.
 * @returns Home filter toggles.
 */
export const HomeFilters: React.FC<IHomeFilterProps> = () => {
  const [active, setActive] = useState<HomeFilterType>(HomeFilterType.Papers);
  const [
    {
      home: { filter },
    },
    { storeHomeFilter: storeFilter },
  ] = useContent();
  const [{ sources, mediaTypes }] = useLookup();

  const defaultFilter: Partial<IFilterSettingsModel> = {
    contentTypes: [],
    sourceIds: [],
    mediaTypeIds: [],
  };

  const handleFilterClick = (type: HomeFilterType) => {
    const updatedFilter = { ...defaultFilter };

    switch (type) {
      case HomeFilterType.Papers:
        updatedFilter.contentTypes = [ContentTypeName.PrintContent];
        break;
      case HomeFilterType.RadioTV:
        updatedFilter.contentTypes = [ContentTypeName.AudioVideo];
        updatedFilter.mediaTypeIds = mediaTypes.filter((p) => p.name !== 'Events').map((p) => p.id);
        break;
      case HomeFilterType.Internet:
        updatedFilter.contentTypes = [ContentTypeName.Story];
        updatedFilter.sourceIds = sources.filter((s) => s.code !== 'CPNEWS').map((s) => s.id);
        updatedFilter.mediaTypeIds = mediaTypes.filter((p) => p.name !== 'Events').map((p) => p.id);
        break;
      case HomeFilterType.CPNews:
        updatedFilter.contentTypes = [ContentTypeName.Story];
        updatedFilter.sourceIds = [sources.find((s) => s.code === 'CPNEWS')?.id ?? 0];
        break;
      case HomeFilterType.Events:
        updatedFilter.mediaTypeIds = [mediaTypes.find((s) => s.name === 'Events')?.id ?? 0];
        break;
      case HomeFilterType.All:
        break;
      default:
        break;
    }
    storeFilter({ ...filter, ...updatedFilter });
  };

  const getClassName = (type: HomeFilterType) => (type === active ? 'active' : 'inactive');

  useEffect(() => {
    if (!filter.contentTypes?.length && !filter.mediaTypeIds?.length) {
      setActive(HomeFilterType.All);
    } else if (
      filter.mediaTypeIds?.includes(mediaTypes.find((s) => s.name === 'Events')?.id ?? 0)
    ) {
      setActive(HomeFilterType.Events);
    } else {
      // currently only support one content type at a time (with the exception of the all filter)
      if (!!filter?.contentTypes?.length) {
        switch (filter.contentTypes[0]) {
          case ContentTypeName.PrintContent:
            setActive(HomeFilterType.Papers);
            break;
          case ContentTypeName.AudioVideo:
            setActive(HomeFilterType.RadioTV);
            break;
          case ContentTypeName.Story:
            if (filter.sourceIds?.length === 1) {
              setActive(HomeFilterType.CPNews);
              break;
            } else {
              setActive(HomeFilterType.Internet);
              break;
            }
          default:
            setActive(HomeFilterType.All);
        }
      }
    }
  }, [filter, mediaTypes]);

  const filters = [
    { type: HomeFilterType.Papers, label: 'PAPERS' },
    { type: HomeFilterType.RadioTV, label: 'RADIO/TV' },
    { type: HomeFilterType.Internet, label: 'INTERNET' },
    { type: HomeFilterType.CPNews, label: 'CP NEWS' },
    { type: HomeFilterType.Events, label: 'EVENTS' },
    { type: HomeFilterType.All, label: 'ALL' },
  ];

  return (
    <styled.HomeFilters className="filter-buttons">
      {filters.map((filter) => (
        <Button
          key={filter.type}
          rounded
          height={ButtonHeight.Small}
          className={getClassName(filter.type)}
          onClick={() => handleFilterClick(filter.type)}
        >
          {filter.label}
        </Button>
      ))}
      <FaGear className="cog" data-tooltip-id="view-options" />
    </styled.HomeFilters>
  );
};
