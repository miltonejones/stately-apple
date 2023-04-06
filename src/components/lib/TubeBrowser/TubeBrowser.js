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
  Spacer,  
  IconTextField,
  CollapsiblePagination,
  HiddenUpload
} from '../../../styled';
import { sorter } from '../../../util/sorter';
import { getPagination } from '../../../util/getPagination';
import { collatePins } from '../../../util/collatePins';
import { contains } from '../../../util/contains';
import { jsonLink } from '../../../util/jsonLink';
import { PlayListMenu } from '../TubeDrawer/TubeDrawer';

const Layout = styled(Box)(({ small, theme }) => ({
  margin: theme.spacing(1, 2),
  width: small ? "80vw" : 400,
}));

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

const Nostack = styled(({ ...props }) => (
  <Nowrap {...props} />
))(({ theme, offset = 0 }) => ({
  width: 300 - offset,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: 'calc(80vw - 120px)', 
  },
}));

const TubeListViewMember = ({ 
  handler,
  handleExpand,
  groups,
  groupKey,
  searchText, 
  handlePlay,
  selectedItem,
  groupItem ,
  playlists,
  handleCategory,
  selected
}) => {

    const pageKey = groupKey + groupItem + '_page';
    const categoryItems = groups[groupKey][groupItem];
    const { artworkUrl100, title } = categoryItems[0];

    const memberKey = `${groupKey}/${groupItem}`;
    // const memberIsSelected = handler.expanded && handler.expanded[memberKey]; 

    const handleNavigate = (type, name) => {
      handleCategory(type);
      handleExpand(`${type}/${name}`, type)
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
      pageSize: 10,
    });
  
    const expandedKey = !handler.expanded 
    ? ""
    : Object.keys(handler.expanded)[0];

    // eslint-disable-next-line 
    const [ _, categoryName] = expandedKey.split('/')

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

     <Flex
        onClick={() => {
          handler.send({
            type: 'CHANGE',
            key: 'expanded',
            value: false
          });
      }} spacing={1} sx={{mb: 2}}>
      <TinyButton icon="ArrowBack" />
     <Nowrap 
        small hover>
      {categoryName}
      </Nowrap>


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


      {pages.visible.map(item => <CategoryItem 
        playlists={groups.Playlists}
        key={item.trackId} 
        item={item} 
        {...itemProps}
        
        />)}
      </>
    )}
    
    
    </>
}

const TubeListViewNode = ({ 
    groups, 
    groupKey, // Albums, Artists, etc
    handler,  
    searchText,
    handlePlay,
    selectedItem,
    handleExpand,
    playlists,
    handleCategory
  }) => { 
  const groupKeys = Object.keys(groups[groupKey]);
  
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

  
  const expandedKey = !handler.expanded 
  ? ""
  : Object.keys(handler.expanded)[0]
  const [ categoryType, categoryName] = expandedKey.split('/')

  const memberProps = {

    handleExpand,  
    playlists,
    handleCategory,
    handler,  
    searchText,  
    groups,   
    handlePlay,  
    selectedItem,  

  }

  return (
    <Stack sx={{ mt: 1}}>
 
      {pages.pageCount > 1 && !handler.expanded && (
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
      <> 
    
      <TubeListViewMember 
           {...memberProps}
           groupItem={groupItem}
           groupKey={groupKey}

        /> </> 
      ))}
 
    {!!handler.expanded && <TubeListViewMember 
        {...memberProps}
        selected
        groupItem={categoryName}
        groupKey={categoryType}
        />}

 
 
    </Stack>
  )
}

const TubeListView = (props) => {
  const { 
    pins, 
    handler, 
    groupKeys, 
    handleCategory,  
    handlePlay,
    selectedItem,
    searchText,
    handleExpand,
    playlists,
    small,
    groups
    // groups,
  } = props;
 

  const pages = getPagination(pins, {
    page: handler.listPage || 1, 
    pageSize: 10,
  });

  const itemProps = {
    handler,
    caption: detailCaption,
    searchText, 
    handlePlay,
    group: pins,
    selectedItem,
    handleExpand,
    playlists,
    ml: 1
  }
 
 

  return (
    <Layout small={small}>

      <Collapse in={!handler.expanded}>
        
      <PillMenu 
         value={handler.category}
         onClick={(key) => handleCategory(key)}
         options={groupKeys}
      />
 
      </Collapse>
 

      {!!handler.category && <TubeListViewNode playlists={playlists} {...props} 
        groupKey={handler.category} />}

     {!handler.category && <Stack sx={{ mt: 2}}>

     {pages.pageCount > 1 && (
        <CollapsiblePagination
          pages={pages}
          page={Number(pages.page)}
          collapsed  
          onChange={(b) => {
            handler.send({
              type: 'CHANGE',
              key: 'listPage',
              value: b
            });
          } }
        />
      )} 



     {pages.visible.map(item => <CategoryItem playlists={groups.Playlists} key={item.trackId} item={item} {...itemProps}/>)}
    
    
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
    handleChange('expanded', false); 
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
  const { groups, playlists } = collatePins(pins);

  
  const groupKeys = Object.keys(groups);
  const diskUsed = JSON.stringify(handler.pins).length;

  const viewProps = {
    groupKeys,
    handleExpand,
    handleCategory,
    pins,
    groups,
    handlePlay,
    selectedItem,
    searchText,
    playlists
  }
  
  return (
    <Drawer anchor="left" onClose={handleClose} open={handler.browse}>
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
              value={handler.view || 'grid'}
              values={['grid', 'list']}
              buttons={['AccountTree', 'ViewList']}
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

        {handler.view === 'list' && <TubeListView       
          {...props}
          {...viewProps}
        />}

      {handler.view !== 'list' && (
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
              
              <CategoryNode 
                groupKey={key}
                handler={handler}
                groups={groups}
                searchText={searchText}
                handlePlay={handlePlay}
                handleExpand={handleExpand}
                selectedItem={selectedItem}
              />  

            </Stack>
          ))} 
        </Layout>)}

        <Spacer />

        <Stack sx={{mt: 4, p: 2}}>
          <Nowrap small muted > {formatBytesToKB(diskUsed)} of 5 MB used</Nowrap>
          <LinearProgress sx={{mb: 2}} variant="determinate" value={diskUsed / 500000} />
          {!!handler.user && <Nowrap small><a download={`${handler.user.username}-bookmarks.json`} 
            title={`${handler.user.username}-boombot.json`}
            href={jsonLink(handler.pins)}>Download bookmarks</a></Nowrap>}
          <HiddenUpload onChange={obj => {
            handler.send({
              type: "MERGE",
              items: obj
            })
          }}>Import bookmarks...</HiddenUpload>
        </Stack>

      </Stack> 
    </Drawer>
  );
};
TubeBrowser.defaultProps = {};
export default TubeBrowser;





const CategoryNode = ({ 
  groups, 
  groupKey, // Albums, Artists, etc
  handler, 
  searchText, 
  handlePlay,
  handleExpand,
  selectedItem
 }) => {

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
      <> 
    
      <CategoryMember 
          handler={handler}  
          searchText={searchText}  
          groups={groups}  
          groupKey={groupKey}  
          handleExpand={handleExpand}  
          handlePlay={handlePlay}  
          selectedItem={selectedItem}  
          groupItem={groupItem}
        /> </> 
      ))}


    </Collapse>
</>
  )
}


const CategoryMember = ({
  handler,
  searchText,
  groups,
  groupKey,
  handleExpand,
  handlePlay,
  selectedItem,
  groupItem,
}) => {
  const memberKey = `${groupKey}/${groupItem}`;
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
                searchText={searchText}
                group={groups[groupKey][groupItem]}
                handler={handler}
                item={item}
                caption={groupCaptions[groupKey]}
                handlePlay={handlePlay}
                selectedItem={selectedItem}
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
        <MenuItem onClick={menu.handleClose('next')}>
          Play next
        </MenuItem>
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
  handler,
  caption,
  searchText,
  item,
  handlePlay,
  group,
  selectedItem,
  playlists = [] ,
  ml = 2
}) => {

  const { title, artworkUrl100, artistName, tubekey, } = item;
  const itemIsSelected = selectedItem.href === tubekey; 

  return (
    <Flex sx={{ ml }} spacing={1}>
      <Avatar
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
            playlists={playlists}
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
          <Nostack muted small>
            {caption(item)}
          </Nostack>
        )}

      </Stack>


    </Flex>
  );
};
