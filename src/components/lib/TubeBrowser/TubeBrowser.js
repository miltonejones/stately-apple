import React from 'react';
import {
  styled,
  Drawer,
  Stack, 
  Avatar,
  Collapse,
  Badge, 
  Box,
  MenuItem,
  Divider,
  LinearProgress, 
  Link
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
} from '../../../styled';
import { sorter } from '../../../util/sorter';
import { getPagination } from '../../../util/getPagination';
import { collatePins } from '../../../util/collatePins';
import { contains } from '../../../util/contains';
import { jsonLink } from '../../../util/jsonLink';
import { PlayListMenu } from '../TubeDrawer/TubeDrawer';
import Login from '../Login/Login';

const BrowserContext = React.createContext();

const Layout = styled(Box)(({ small, theme }) => ({
  margin: theme.spacing(1, 2),
  width: small ? "80vw" : 400,
}));

const delimiter = '~';

const detailCaption = e => `${e.artistName} - ${e.collectionName}`;

const groupCaptions = {
  Artists: e => e.collectionName,
  Albums: e => e.artistName,
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
      width: 'calc(80vw - 120px)',
    },
  })
);


const useTubePagination = () => {
  const {    
    handler,   
    groups,
    pageSize
  } = React.useContext(BrowserContext);

  const groupKey = handler.category; 
  const groupKeys = !groupKey ? [] : Object.keys(groups[groupKey]);
  const categoryKey = groupKey + '_page';

  const pages = getPagination(groupKeys.sort(), {
    page: handler[categoryKey] || 1, 
    pageSize 
  });

  const handlePage = (value) => { 
    handler.send({
      type: 'CHANGE',
      key: categoryKey,
      value
    });
  }; 

  return {
    pages,
    handlePage,
    groupKey,
    categoryKey
  }


}


const TubeListViewMember = ({ 
    groupItem ,
    groupKey,
    selected,
  }) => {

    const { 
      handleCategory,
      handleChange,
      handleExpand,
      handlePlay,
      handler,
      groups, 
      searchText, 
      selectedItem,
      gridColumns,
      pageSize
    } = React.useContext(BrowserContext);


    const pageKey = groupKey + groupItem + '_page';
    const categoryItems = groups[groupKey][groupItem];
    const { artworkUrl100, title } = categoryItems[0];

    const memberKey = `${groupKey}${delimiter}${groupItem}`;
    // const memberIsSelected = handler.expanded && handler.expanded[memberKey]; 

    const handleNavigate = (type, name) => {
      handleCategory(type);
      handleExpand(`${type}${delimiter}${name}`, type)
    }

    const itemProps = {
      handler,
      caption: e => <>
      <Link onClick={() => handleNavigate('Artists', e.artistName)}>{e.artistName}</Link>
        {" - "}<Link onClick={() => handleNavigate(`Albums`, e.collectionName)}>{e.collectionName}</Link>
      </>,
      group: categoryItems,

      searchText, 
      handlePlay,
      selectedItem,
      handleExpand,

      ml: 1
    }
  
    const pages = getPagination(categoryItems, {
      page: handler[pageKey] || 1, 
      pageSize 
    });
  
    const expandedKey = !handler.expanded 
          ? ""
          : Object.keys(handler.expanded)[0];
 
    const [ categoryType, categoryName] = expandedKey.split(delimiter);

 

    return <>
    
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

     <Flex spacing={1} sx={{mb: 2}}>

      <TinyButton onClick={() => handleChange('expanded', false)} icon="ArrowBack" />
     
      <Stack onClick={() => handleChange('expanded', false)} >
        <Nowrap sx={{ lineHeight: 1 }} tiny hover muted>{categoryType}</Nowrap>
        <Nowrap sx={{ lineHeight: 1 }} small hover>{categoryName}</Nowrap>
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
              value: b
            });
          } }
        />
      )} 
      
     </Flex>

    <Columns columns={gridColumns}>
      {pages.visible.map(item => <CategoryItem  
        key={item.trackId} 
        item={item} 
        {...itemProps}
        
      />)}
    </Columns>




      </>
    )}
    
    
    </>
}

const TubeListViewNode = ({ groupKey }) => { 


    const { handler } = React.useContext(BrowserContext);
  
  
    const categoryPagination = useTubePagination() 

  
  const expandedKey = !handler.expanded 
      ? ""
      : Object.keys(handler.expanded)[0]
  const [ categoryType, categoryName] = expandedKey.split(delimiter); 

  return (
    <Stack sx={{ mt: 1}}>
  

    {categoryPagination.pages.visible.map((groupItem) => (  
      <TubeListViewMember  
        groupItem={groupItem}
        groupKey={groupKey} 
      />  
      ))}
 
    {!!handler.expanded && (
      <TubeListViewMember  
        selected
        groupItem={categoryName}
        groupKey={categoryType}
      />
        )}

 
 
    </Stack>
  )
}

const TubeListView = () => {
 
 
  const {   
    pins, 
    handler, 
    groupKeys, 
    handleCategory,   
    handleChange, 
    small, 
    gridColumns,
    pageSize
  } = React.useContext(BrowserContext);


  const pages = getPagination(pins, {
    page: handler.listPage || 1, 
    pageSize
  });

  const itemProps = {
    handler,
    caption: detailCaption, 
    group: pins,  
    ml: 1
  }
 
  const categoryPagination = useTubePagination()
 

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
            onChange={(b) => handleChange(categoryPagination.categoryKey, b)  }
          />
        )}

      {pages.pageCount > 1 && !handler.category && (
        <CollapsiblePagination
          pages={pages}
          nolabel
          page={Number(pages.page)}
          collapsed  
          onChange={(b) => handleChange('listPage', b)  }
        />
      )} 



      </Flex>
 
      </Collapse>
 

      {!!handler.category && <TubeListViewNode groupKey={handler.category} />}

     {!handler.category && <Stack sx={{ mt: 2}}>
 
        
    <Columns columns={gridColumns}>
      {pages.visible.map(item => <CategoryItem  
          key={item.trackId} 
          item={item} 
          {...itemProps}
        />)} 
    </Columns>


    
     </Stack>}
      
    </Layout>
  )
}

const TubeBrowser = (props) => {
  // const menu = useMenu();

  const { handler, small, searchText: searchMethod } = props;



  const selectedItem = !handler.response?.pages
    ? {}
    : handler.response.pages[0];

  

  const handleChange = (key, value) => {
    handler.send({ type: 'CHANGE', key, value });
  };


  const handleView = (view) => {
    handleChange("view", view); 
    // handleChange('expanded', false); 
  };
  
  const handleClose = () => {
    handleChange('browse', !handler.browse); 
  };
  
  const handleFilter = (value) => {
    handleChange('filter', value); 
  }; 
  
  const handleCategory = (value) => {
    handleChange('category', value); 
    handleChange('expanded', false); 
  }; 
  
  const handleExpand = (node, exclusive) => { 
    handleChange('expanded', exclusive ? { 
      [node]: true,
      [exclusive]: true
    } : {
      ...handler.expanded,
      [node]: !(handler.expanded && handler.expanded[node]),
    }); 
  }; 
   

  const searchText = (param) => {
    searchMethod(param);
    handleClose(); 
  }

  const handlePlay = (track, items, queue) => {
    handler.send({
      type: queue ? 'QUEUE' : 'FIND',
      param: track.param,
      track,
      items
    });

    !!small && handleClose();
  }
   

  function formatBytesToKB(bytes) {
    const mb = 1024 * 1024;
    if (bytes < mb) {
      return Math.round(bytes / 1024) + 'kb'
    }
    return Math.round(bytes / mb) + 'mb'
  }

  const pins = !handler.filter 
    ? handler.pins 
    : handler.pins.filter(f => contains(f.title, handler.filter) || 
          contains(f.artistName, handler.filter) || 
          contains(f.collectionName, handler.filter)  )
  const { groups } = collatePins(pins);

  
  const groupKeys = Object.keys(groups);
  const diskUsed = JSON.stringify(handler.pins).length;
  const gridColumns = handler.view !== 'grid' ? '1fr' : small ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr";
  const pageSize = handler.view === 'grid' ? 12 : 10;

  const viewProps = {
    groupKeys,
    groups,
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
    small
  }
  
  return (
    <BrowserContext.Provider value={viewProps}>
      <Drawer anchor="left" onClose={handleClose} open={handler.browse && !!handler.user}>
        <Stack>
          {!handler.state.can('FIND') && <>The librarian is busy right now. Try again later.</>}

          {/* drawer toolbar */}
          <Flex
            spacing={1}
            sx={{ 
              p: theme => theme.spacing(2,1),
            }}
          >
            <TinyButton icon="YouTube" />
            <Badge max={10000} color="success" badgeContent={handler.pins?.length}><Nowrap small>Saved videos</Nowrap></Badge>


            <Spacer /> 

            <TinyButtonGroup
                onChange={handleView }
                value={handler.view || 'tree'}
                values={['grid', 'tree', 'list']}
                buttons={['GridView', 'AccountTree', 'ViewList']}
              />

            <TinyButton onClick={() => handleClose()} icon="Close" />
          </Flex>

          {/* search box */}
          <Flex sx={{ p: 1 }}>
            <IconTextField 
              endIcon={<TinyButton onClick={() => handleFilter("")} icon={!!handler.filter ? "Close" : "Search"} />}
              value={handler.filter}
              onChange={e => handleFilter(e.target.value)}
              size="small"
              label="Filter"
              fullWidth
              />
          </Flex>
    
          {/* collection groups */}

          {handler.view !== 'tree' && <TubeListView  />}

          {handler.view === 'tree' && (
            <Layout small={small}>
              {groupKeys.map((key) => (
                <Stack>  

                  <Flex spacing={1}>
                    <TinyButton icon={groupIcons[key]}  
                      color={ handler.expanded && handler.expanded[key] ? "error" : "inherit"}
                    />
                    <Nowrap muted={!(handler.expanded && handler.expanded[key])} small hover 
                        onClick={() => handleExpand(key)}>
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
            value={diskUsed / 500000}
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

          <Login tube={handler}>
            <Nowrap small hover>Sign out</Nowrap>
          </Login>

        </Stack>;


        </Stack> 
      </Drawer>
    </BrowserContext.Provider>
  );
};
TubeBrowser.defaultProps = {};
export default TubeBrowser;





const CategoryNode = ({ groupKey }) => {

  const {  
    groups,  
    handler,   
  } = React.useContext(BrowserContext);

  const isExpanded = handler.expanded && handler.expanded[groupKey];
  const groupKeys = Object.keys(groups[groupKey]);
  
  const matchingMembers =  !!handler.filter && groupKeys.some(f => contains(f, handler.filter))
  const matchingMemberKids = !!matchingMembers && groupKeys.some(f => {
    const group = groups[groupKey][f]; 
    return group.find(f => contains(f.title, handler.filter) || 
      contains(f.artistName, handler.filter) || 
      contains(f.collectionName, handler.filter)  ) 
  })


  if (!(isExpanded || matchingMembers || matchingMemberKids)) {
    return <i />
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
      value
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
          onChange={(b) =>
            handlePage(b)
          }
        />
      )} 


      {pages.visible.map((groupItem) => (  
        <CategoryMember  
          groupKey={groupKey}   
          groupItem={groupItem}
        />
      ))}


    </Collapse>
</>
  )
}

const CategoryMember = ({ groupKey, groupItem }) => {

  const {  
    groups, 
    handleExpand,
    handler,  
  } = React.useContext(BrowserContext);


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
            .sort(sorter('trackNumber'))
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

const CategoryItemMenu = ({ handler, handleFind, item, handleQueue, handlePlay }) => {
  const methods = {
    play: handlePlay,
    drop: () =>
      handler.send({
        type: 'PIN',
        pin: item,
      }),
    find: handleFind,
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
        <MenuItem onClick={menu.handleClose('play')}>
          Play {item.title}
        </MenuItem>
        {!!handler.items?.length && <MenuItem onClick={menu.handleClose('next')}>
          Play next
        </MenuItem>}
        <MenuItem onClick={menu.handleClose('find')}>
          Find more by "{item.artistName}"
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

const CategoryItem = ({ 
    caption, 
    item, 
    group,  
    ml = 2
  }) => {

  const {  
    groups,
    handlePlay,
    handler, 
    searchText, 
    selectedItem,
  } = React.useContext(BrowserContext);

  const { title, artworkUrl100, artistName, tubekey, } = item;
  const itemIsSelected = selectedItem.href === tubekey; 

  if (handler.view === 'grid') {
    const maxWidth = 90;
    return <Stack>
      <img
        onClick={() => handlePlay(item, group)} 
        variant="rounded"
        src={artworkUrl100}
        alt={title}
        style={{ 
          width: '100%', 
          aspectRatio: '1 / 1' }}
      />
      <Nowrap sx={{ maxWidth }} 
       
        error={itemIsSelected}
        bold={itemIsSelected}
        onClick={() => handlePlay(item, group)} 
        hover
        small

      > {title}</Nowrap>

      {!!caption && (
          <Nowrap muted tiny sx={{ maxWidth }}>
            {caption(item)}
          </Nowrap>
        )}

    </Stack>
  }


  return (
    <Flex sx={{ ml }} spacing={1}>
      <Avatar
        onClick={() => handlePlay(item, group)} 
        variant="rounded"
        src={artworkUrl100}
        alt={title}
        sx={{ width: 32, height: 32 }}
      />
      <Stack> 
        <Flex spacing={1}>
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
            handleFind={() => searchText(artistName)}  
            handlePlay={() => handlePlay(item, group)}  
            handleQueue={() => handlePlay(item, group, true)}  
           />
        </Flex>

        {!!caption && (
          <Nostack 
          onClick={() => handlePlay(item, group)}  muted small>
            {caption(item)}
          </Nostack>
        )}

      </Stack>


    </Flex>
  );
};
