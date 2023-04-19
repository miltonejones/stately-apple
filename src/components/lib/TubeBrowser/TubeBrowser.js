import React from 'react';
import {
  styled,
  Drawer,
  Stack,
  Avatar,
  Collapse,
  Box,
  MenuItem,
  Divider,
  CircularProgress,
  LinearProgress,
  Link,
  Slider,
  IconButton,
} from '@mui/material';
import { useMenu } from '../../../machines';
import {
  Nowrap,
  PillMenu,
  TinyButton,
  TinyButtonGroup,
  Flex,
  FlexMenu,
  Columns,
  Spacer,
  IconTextField,
  CollapsiblePagination,
  HiddenUpload,
  Shield,
} from '../../../styled';
import { sorter } from '../../../util/sorter';
import { getPagination } from '../../../util/getPagination';
import { collatePins } from '../../../util/collatePins';
import { contains } from '../../../util/contains';
import { jsonLink } from '../../../util/jsonLink';
import { PlayListMenu } from '../TubeDrawer/TubeDrawer';
import Login from '../Login/Login';
// import ProfilePhotoForm from '../ProfilePhotoForm/ProfilePhotoForm';

const BrowserContext = React.createContext();

const Layout = styled(Box)(({ small, theme }) => ({
  margin: theme.spacing(1, 2),
  width: small ? '90vw' : 400,
}));

const delimiter = '~';

const detailCaption = (e) => `${e.artistName} - ${e.collectionName}`;

const groupCaptions = {
  Artists: (e) => e.collectionName,
  Albums: (e) => e.artistName,
  Genres: detailCaption,
  Playlists: detailCaption,
};

const groupIcons = {
  Artists: 'People',
  Albums: 'Album',
  Genres: 'Sell',
  Playlists: 'QueueMusic',
};

const Nostack = styled(({ ...props }) => <Nowrap {...props} />)(
  ({ theme, offset = 0 }) => ({
    width: 300 - offset,
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      width: 'calc(90vw - 120px)',
    },
  })
);

const Halfwrap = styled(({ ...props }) => <Nowrap {...props} />)(
  ({ theme }) => ({
    width: 200,
    overflow: 'hidden',
    lineHeight: 1,
    [theme.breakpoints.down('md')]: {
      width: '40vw',
    },
  })
);

const Gridwrap = styled(({ ...props }) => <Nowrap {...props} />)(
  ({ theme, offset }) => ({
    width: `calc(100px - ${offset}px)`,
    overflow: 'hidden',
    lineHeight: 1,
    [theme.breakpoints.down('md')]: {
      width: `calc(30vw - ${offset}px)`,
    },
  })
);

const Hand = styled((props) => <Link {...props} underline="hover" />)(
  ({ theme }) => ({
    color: theme.palette.text.secondary,
    cursor: 'pointer',
  })
);

const useTubePagination = () => {
  const { handler, groups, pageSize } = React.useContext(BrowserContext);

  const groupKey = handler.category;
  const groupKeys = !groupKey ? [] : Object.keys(groups[groupKey]);
  const categoryKey = groupKey + '_page';

  const pages = getPagination(groupKeys.sort(), {
    page: handler[categoryKey] || 1,
    pageSize,
  });

  const handlePage = (value) => {
    handler.send({
      type: 'CHANGE',
      key: categoryKey,
      value,
    });
  };

  return {
    pages,
    handlePage,
    groupKey,
    categoryKey,
  };
};

const TubeListViewMember = ({ groupItem, groupKey, selected }) => {
  const {
    navigateCaption,
    handleChange,
    handleExpand,
    handlePlay,
    handler,
    groups,
    searchText,
    selectedItem,
    gridColumns,
    pageSize,
  } = React.useContext(BrowserContext);

  const pageKey = groupKey + groupItem + '_page';
  const categoryItems = groups[groupKey][groupItem];

  if (!categoryItems?.length) {
    return <i />;
  }
  const { artworkUrl100, title } = categoryItems[0];

  const memberKey = `${groupKey}${delimiter}${groupItem}`;
  // const memberIsSelected = handler.expanded && handler.expanded[memberKey];

  // const handleNavigate = (type, name) => {
  //   handleCategory(type);
  //   handleExpand(`${type}${delimiter}${name}`, type)
  // }

  const itemProps = {
    handler,
    caption: navigateCaption,
    group: categoryItems,

    searchText,
    handlePlay,
    selectedItem,
    handleExpand,

    ml: 1,
  };

  const pages = getPagination(categoryItems
    .sort(sorter('trackNumber', -1))
    .sort(sorter('discNumber', 1))
    , {
    page: handler[pageKey] || 1,
    pageSize,
  });

  const expandedKey = !handler.expanded ? '' : Object.keys(handler.expanded)[0];

  const [categoryType, categoryName] = expandedKey.split(delimiter);

  return (
    <>
      <Collapse in={!handler.expanded}>
        <Flex spacing={1}>
          <Avatar
            variant="rounded"
            src={artworkUrl100}
            alt={title}
            sx={{ width: 32, height: 32 }}
          />
          <Stack>
            <Nostack onClick={() => handleExpand(memberKey)} small hover>
              {groupItem}
            </Nostack>
            <Nostack small muted>
              {categoryItems.length} tracks
            </Nostack>
          </Stack>
        </Flex>
      </Collapse>

      {!!selected && (
        <>
          <Flex spacing={1} sx={{ mb: 2 }}>
            <TinyButton
              onClick={() => handleChange('expanded', false)}
              icon="ArrowBack"
            />

            <Stack onClick={() => handleChange('expanded', false)}>
              <Halfwrap tiny hover muted>
                {categoryType}
              </Halfwrap>
              <Halfwrap small hover>
                {categoryName}
              </Halfwrap>
            </Stack>

            <Spacer />
            {pages.pageCount > 1 && (
              <CollapsiblePagination
                pages={pages}
                page={Number(pages.page)}
                collapsed
                onChange={(b) => {
                  handler.send({
                    type: 'CHANGE',
                    key: pageKey,
                    value: b,
                  });
                }}
              />
            )}
          </Flex>

          <Columns spacing={0.5} columns={gridColumns}>
            {pages.visible.map((item) => (
              <CategoryItem key={item.trackId} item={item} {...itemProps} />
            ))}
          </Columns>
        </>
      )}
    </>
  );
};

const TubeListViewNode = ({ groupKey }) => {
  const { handler } = React.useContext(BrowserContext);

  const categoryPagination = useTubePagination();

  const expandedKey = !handler.expanded ? '' : Object.keys(handler.expanded)[0];
  const [categoryType, categoryName] = expandedKey.split(delimiter);

  return (
    <Stack sx={{ mt: 1 }}>
      {categoryPagination.pages.visible.map((groupItem) => (
        <TubeListViewMember groupItem={groupItem} groupKey={groupKey} />
      ))}

      {!!handler.expanded && (
        <TubeListViewMember
          selected
          groupItem={categoryName}
          groupKey={categoryType}
        />
      )}
    </Stack>
  );
};

const TubeListView = () => {
  const {
    pins,
    handler,
    groupKeys,
    handleCategory,
    handleChange,
    small,
    gridColumns,
    navigateCaption,
    pageSize,
  } = React.useContext(BrowserContext);

  const pages = getPagination(pins, {
    page: handler.listPage || 1,
    pageSize,
  });

  const itemProps = {
    handler,
    caption: navigateCaption,
    group: pins,
    ml: 1,
  };

  const categoryPagination = useTubePagination();

  return (
    <Layout small={small}>
      <Collapse in={!handler.expanded}>
        <Flex>
          <PillMenu
            value={handler.category}
            onClick={(key) => handleCategory(key)}
            options={groupKeys}
          />

          <Spacer />

          {!!handler.category && categoryPagination.pages.pageCount > 1 && (
            <CollapsiblePagination
              pages={categoryPagination.pages}
              page={Number(categoryPagination.pages.page)}
              collapsed
              onChange={(b) => handleChange(categoryPagination.categoryKey, b)}
            />
          )}

          {pages.pageCount > 1 && !handler.category && (
            <>
              <IconButton
                onClick={(b) => handleChange('showPage', !handler.showPage)}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                <CircularProgress
                  size={18}
                  variant="determinate"
                  value={100 * (pages.page / pages.pageCount)}
                />
              </IconButton>

              <CollapsiblePagination
                pages={pages}
                nolabel
                page={Number(pages.page)}
                collapsed
                onChange={(b) => handleChange('listPage', b)}
              />
            </>
          )}
        </Flex>

        <Collapse in={handler.showPage}>
          <Flex spacing={1}>
            <Nowrap wrap small muted>
              {pages.page}
            </Nowrap>
            <Slider
              value={Number(pages.page)}
              onChange={(_, b) => handleChange('listPage', b)}
              step={1}
              min={1}
              max={pages.pageCount}
            />
            <Nowrap wrap small muted>
              {pages.pageCount}
            </Nowrap>
          </Flex>
        </Collapse>
      </Collapse>

      {!!handler.category && <TubeListViewNode groupKey={handler.category} />}

      {!handler.category && (
        <Stack sx={{ mt: 2 }}>
          <Columns spacing={0.25} columns={gridColumns}>
            {pages.visible.map((item) => (
              <CategoryItem key={item.trackId} item={item} {...itemProps} />
            ))}
          </Columns>
        </Stack>
      )}
    </Layout>
  );
};

const TubeBrowser = (props) => {
  const { handler, small, searchText: searchMethod } = props;

  const selectedItem = !handler.response?.pages
    ? {}
    : handler.response.pages[0];

  const handleChange = (key, value) => {
    handler.send({ type: 'CHANGE', key, value });
  };

  const handleView = (view) => {
    handleChange('view', view);
  };

  const handleClose = () => {
    handleChange('browse', !handler.browse);
  };

  const handleFilter = (value) => {
    handleChange('filter', value);
    handleChange('listPage', 1);
  };

  const handleCategory = (value) => {
    handleChange('category', value);
    handleChange('expanded', false);
  };

  const handleExpand = (node, exclusive) => {
    handleChange(
      'expanded',
      exclusive
        ? {
            [node]: true,
            [exclusive]: true,
          }
        : {
            ...handler.expanded,
            [node]: !(handler.expanded && handler.expanded[node]),
          }
    );
  };

  const handleNavigate = (type, name) => {
    handleCategory(type);
    handleExpand(`${type}${delimiter}${name}`, type);
  };

  const navigateCaption = (e) => (
    <>
      <Hand onClick={() => handleNavigate('Artists', e.artistName)}>
        {e.artistName}
      </Hand>
      {' - '}
      <Hand onClick={() => handleNavigate(`Albums`, e.collectionName)}>
        {e.collectionName}
      </Hand>
    </>
  );

  const searchText = (param) => {
    searchMethod(param);
    handleClose();
  };

  const handlePlay = (track, items, queue) => {
    handler.send({
      type: queue ? 'QUEUE' : 'FIND',
      param: track.param,
      track,
      items,
    });

    !!small && handleClose();
  };

  function formatBytesToKB(bytes) {
    const mb = 1024 * 1024;
    if (bytes < mb) {
      return Math.round(bytes / 1024) + 'kb';
    }
    return Math.round(bytes / (mb / 100)) / 100 + 'MB';
  }

  const pins = !handler.filter
    ? handler.pins
    : handler.pins.filter(
        (f) =>
          contains(f.title, handler.filter) ||
          contains(f.artistName, handler.filter) ||
          contains(f.collectionName, handler.filter)
      );
  const { groups } = collatePins(pins);

  const groupKeys = Object.keys(groups);
  const diskUsed = JSON.stringify(handler.pins).length;
  const gridColumns =
    handler.view !== 'grid' ? '1fr' : small ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr';
  const pageSize = handler.view === 'grid' ? 9 : 10;

  const viewProps = {
    groupKeys,
    groups,
    navigateCaption,
    handleNavigate,
    handleCategory,
    handleChange,
    handleExpand,
    handlePlay,
    handler,
    pins,
    gridColumns,
    searchText,
    selectedItem,
    pageSize,
    small,
  };

  return (
    <BrowserContext.Provider value={viewProps}>
      <Drawer
        anchor="left"
        onClose={handleClose}
        open={handler.browse && !!handler.user}
      >
        <Stack>
          {!handler.state.can('FIND') && (
            <>The librarian is busy right now. Try again later.</>
          )}

          {/* drawer toolbar */}
          <Flex
            spacing={1}
            sx={{
              p: (theme) => theme.spacing(2, 1),
            }}
          >
            <TinyButton icon="YouTube" />

            <Shield badgeContent={handler.pins?.length}>
              <Nowrap small>Saved previews</Nowrap>
            </Shield>

            <Spacer />

            <TinyButtonGroup
              onChange={handleView}
              value={handler.view || 'tree'}
              values={['grid', 'tree', 'list']}
              buttons={['GridView', 'AccountTree', 'ViewList']}
            />

            <TinyButton onClick={() => handleClose()} icon="Close" />
          </Flex>

          {/* search box */}
          <Flex sx={{ p: 1 }}>
            <IconTextField
              endIcon={
                <TinyButton
                  onClick={() => handleFilter('')}
                  icon={!!handler.filter ? 'Close' : 'Search'}
                />
              }
              value={handler.filter}
              onChange={(e) => handleFilter(e.target.value)}
              size="small"
              label="Filter"
              fullWidth
            />
          </Flex>

          {/* collection groups */}
          {handler.view !== 'tree' && <TubeListView />}

          {handler.view === 'tree' && (
            <Layout small={small}>
              {groupKeys.map((key) => (
                <Stack>
                  <Flex spacing={1}>
                    <TinyButton
                      icon={groupIcons[key]}
                      color={
                        handler.expanded && handler.expanded[key]
                          ? 'error'
                          : 'inherit'
                      }
                    />
                    <Nowrap
                      muted={!(handler.expanded && handler.expanded[key])}
                      small
                      hover
                      onClick={() => handleExpand(key)}
                    >
                      {key}
                    </Nowrap>
                  </Flex>

                  <CategoryNode groupKey={key} />
                </Stack>
              ))}
            </Layout>
          )}

          <Spacer />

          <Stack sx={{ mt: 4, p: 2 }}>
            <Nowrap small muted>
              {' '}
              {formatBytesToKB(diskUsed)} of 5 MB used
            </Nowrap>

            <LinearProgress
              sx={{ mb: 2 }}
              variant="determinate"
              value={diskUsed / 50000}
            />

            {!!handler.user && (
              <Nowrap small>
                <a
                  download={`${handler.user.username}-bookmarks.json`}
                  title={`${handler.user.username}-boombot.json`}
                  href={jsonLink(handler.pins)}
                >
                  Download bookmarks
                </a>
              </Nowrap>
            )}

            <HiddenUpload
              onChange={(obj) => {
                handler.send({
                  type: 'MERGE',
                  items: obj,
                });
              }}
            >
              Import bookmarks...
            </HiddenUpload>

            {/* <ProfilePhotoForm /> */}

            <Login tube={handler}>
              <Nowrap small hover>
                Edit profile
              </Nowrap>
            </Login>
          </Stack>
        </Stack>
      </Drawer>
    </BrowserContext.Provider>
  );
};

TubeBrowser.defaultProps = {};
export default TubeBrowser;

const CategoryNode = ({ groupKey }) => {
  const { groups, handler } = React.useContext(BrowserContext);

  const isExpanded = handler.expanded && handler.expanded[groupKey];
  const groupKeys = Object.keys(groups[groupKey]);

  const matchingMembers =
    !!handler.filter && groupKeys.some((f) => contains(f, handler.filter));
  const matchingMemberKids =
    !!matchingMembers &&
    groupKeys.some((f) => {
      const group = groups[groupKey][f];
      return group.find(
        (f) =>
          contains(f.title, handler.filter) ||
          contains(f.artistName, handler.filter) ||
          contains(f.collectionName, handler.filter)
      );
    });

  if (!(isExpanded || matchingMembers || matchingMemberKids)) {
    return <i />;
  }

  const pageKey = groupKey + '_page';

  const pages = getPagination(groupKeys.sort(), {
    page: handler[pageKey] || 1,
    pageSize: 10,
  });

  const handlePage = (value) => {
    handler.send({
      type: 'CHANGE',
      key: pageKey,
      value,
    });
  };

  return (
    <>
      <Collapse in={isExpanded || matchingMembers || matchingMemberKids}>
        {/* category collections */}

        {pages.pageCount > 1 && (
          <CollapsiblePagination
            pages={pages}
            page={Number(pages.page)}
            collapsed
            onChange={(b) => handlePage(b)}
          />
        )}

        {pages.visible.map((groupItem) => (
          <CategoryMember groupKey={groupKey} groupItem={groupItem} />
        ))}
      </Collapse>
    </>
  );
};

const CategoryMember = ({ groupKey, groupItem }) => {
  const { groups, handleExpand, handler } = React.useContext(BrowserContext);

  const memberKey = `${groupKey}${delimiter}${groupItem}`;
  const memberIsSelected = handler.expanded && handler.expanded[memberKey];
  const categoryItems = groups[groupKey][groupItem];

  const matchingMemberKids =
    !!handler.filter &&
    categoryItems.some(
      (f) =>
        contains(f.title, handler.filter) ||
        contains(f.artistName, handler.filter) ||
        contains(f.collectionName, handler.filter)
    );

  return (
    <Stack sx={{ ml: 2 }}>
      <Flex spacing={1}>
        <TinyButton icon="KeyboardArrowDown" deg={memberIsSelected ? 0 : 270} />
        <Nowrap small hover onClick={() => handleExpand(memberKey)}>
          {' '}
          {groupItem}
        </Nowrap>
      </Flex>

      <Collapse in={memberIsSelected || matchingMemberKids}>
        {/* collection tracks */}
        {(memberIsSelected || matchingMemberKids) &&
          categoryItems
            .sort(sorter('trackNumber', -1))
            .sort(sorter('discNumber', 1))
            .map((item) => (
              <CategoryItem
                group={groups[groupKey][groupItem]}
                item={item}
                caption={groupCaptions[groupKey]}
                key={item.trackId}
              />
            ))}
      </Collapse>
    </Stack>
  );
};

const CategoryItemMenu = ({
  handler,
  handleFind,
  item,
  handleQueue,
  handlePlay,
  disabled,
}) => {
  const { navigateCaption, handleNavigate } = React.useContext(BrowserContext);
  const { title, artworkUrl100, artistName, collectionName } = item;

  const methods = {
    play: handlePlay,
    drop: () =>
      handler.send({
        type: 'PIN',
        pin: item,
      }),
    find: handleFind('artistName'),
    name: () => handleNavigate('Artists', artistName),
    tape: () => handleNavigate('Albums', collectionName),
    disc: handleFind('collectionName'),
    next: handleQueue,
  };
  const menu = useMenu((action) => !!action && methods[action]());
  return (
    <>
      <TinyButton onClick={menu.handleClick} icon="MoreVert" />
      <FlexMenu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <TrackInfo
          image={artworkUrl100}
          title={title}
          sx={{ p: 2 }}
          size={48}
          spacing={1}
          caption={navigateCaption(item)}
        >
          {title}
        </TrackInfo>
        <Divider />
        <MenuItem disabled={disabled} onClick={menu.handleClose('play')}>
          Play {title}
        </MenuItem>
        {!!handler.items?.length && (
          <MenuItem disabled={disabled} onClick={menu.handleClose('next')}>
            Add to queue
          </MenuItem>
        )}
        <MenuItem onClick={menu.handleClose('name')}>View artist</MenuItem>
        <MenuItem onClick={menu.handleClose('tape')}>View album</MenuItem>
        <Divider />
        <MenuItem onClick={menu.handleClose('find')}>
          Find more by "{artistName}"
        </MenuItem>
        <MenuItem onClick={menu.handleClose('disc')}>
          Find more from "{collectionName}"
        </MenuItem>
        <Divider />
        <MenuItem onClick={menu.handleClose('drop')}>
          <Nowrap bold error>
            Unpin
          </Nowrap>
        </MenuItem>
      </FlexMenu>
    </>
  );
};

const CategoryItem = ({ caption, item, group, ml = 2 }) => {
  const { groups, handlePlay, handler, searchText, selectedItem } =
    React.useContext(BrowserContext);

  const { title, artworkUrl100, tubekey } = item;
  const itemIsSelected = selectedItem.href === tubekey;

  if (handler.view === 'grid') {
    return (
      <Stack sx={{ mb: 1 }}>
        <img
          onClick={() => handlePlay(item, group)}
          variant="rounded"
          src={artworkUrl100}
          alt={title}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            cursor: 'pointer',
          }}
        />
        <Flex spacing={0.5}>
          <PlayListMenu
            pinnedItem={item}
            tube={handler}
            playlists={groups.Playlists}
          />

          <Gridwrap
            offset={24}
            error={itemIsSelected}
            bold={itemIsSelected}
            onClick={() => handlePlay(item, group)}
            hover
            small
          >
            {title}
          </Gridwrap>
        </Flex>

        {!!caption && (
          <Flex>
            <Gridwrap offset={18} muted tiny>
              {caption(item)}
            </Gridwrap>
            <Spacer />
            <CategoryItemMenu
              handler={handler}
              item={item}
              handleFind={(key) => () => searchText(item[key])}
              handlePlay={() => handlePlay(item, group)}
              handleQueue={() => handlePlay(item, group, true)}
            />
          </Flex>
        )}
      </Stack>
    );
  }

  return (
    <TrackInfo
      image={artworkUrl100}
      title={title}
      caption={caption(item)}
      sx={{ ml }}
      spacing={1}
    >
      <PlayListMenu
        pinnedItem={item}
        tube={handler}
        playlists={groups.Playlists}
      />

      <Nostack
        offset={24}
        color={itemIsSelected ? 'error' : 'inherit'}
        bold={itemIsSelected}
        onClick={() => handlePlay(item, group)}
        hover
        small
      >
        {title}
        
      </Nostack>

      <Spacer />

      <CategoryItemMenu
        handler={handler}
        item={item}
        disabled={itemIsSelected}
        handleFind={(key) => () => searchText(item[key])}
        handlePlay={() => handlePlay(item, group)}
        handleQueue={() => handlePlay(item, group, true)}
      />
    </TrackInfo>
  );
};

const TrackInfo = ({
  children,
  image,
  title,
  caption,
  size = 32,
  ...props
}) => {
  return (
    <Flex {...props}>
      <Avatar
        variant="rounded"
        src={image}
        alt={title || image}
        sx={{ width: size, height: size }}
      />

      <Stack>
        <Flex spacing={1}>{children}</Flex>

        {!!caption && (
          <Nostack muted small>
            {caption}
          </Nostack>
        )}
      </Stack>
    </Flex>
  );
};
