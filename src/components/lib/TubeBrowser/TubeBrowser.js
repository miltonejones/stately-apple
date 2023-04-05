import React from 'react';
import {
  styled,
  Drawer,
  Stack, 
  Avatar,
  Collapse,
  Box,
  LinearProgress, 
} from '@mui/material';
// import { useMenu } from '../../../machines';
import {
  Nowrap,
  TinyButton,
  Flex,
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

const Layout = styled(Box)(({ small, theme }) => ({
  margin: theme.spacing(1, 2),
  width: small ? "80vw" : 400,
}));

const detailCaption = e => `${e.artistName} - ${e.collectionName}`;

const groupCaptions = {
  Artists: e => e.collectionName,
  Albums: e => e.artistName,
  Genres: detailCaption,
};

const groupIcons = {
  Artists: 'People',
  Albums: 'Album',
  Genres: 'Sell',
};

const Nostack = styled(({ ...props }) => (
  <Nowrap {...props} direction="row" />
))(({ theme }) => ({
  width: 300,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: 'calc(80vw - 80px)', 
  },
}));
  

const TubeBrowser = ({ handler, small, searchText: searchMethod }) => {
  // const menu = useMenu();


  const selectedItem = !handler.response?.pages
    ? {}
    : handler.response.pages[0];
  const handleClose = () => {
    handler.send({
      type: 'CHANGE',
      key: 'browse',
      value: !handler.browse,
    });
  };
  const handleFilter = (value) => {
    handler.send({
      type: 'CHANGE',
      key: 'filter',
      value
    });
  };

  const searchText = (param) => {
    searchMethod(param);
    handleClose(); 
  }

  const handleExpand = (node) => {
    handler.send({
      type: 'CHANGE',
      key: 'expanded',
      value: {
        ...handler.expanded,
        [node]: !(handler.expanded && handler.expanded[node]),
      },
    });
  };
  const handlePlay = (track, items) => {
 
    handler.send({
      type: 'FIND',
      param: track.param,
      track,
      items
    });

    handleClose();
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
  // const notExpanded =!handler.expanded || !Object.values(handler.expanded).find(value => !!value)

 
  return (
    <Drawer anchor="left" onClose={handleClose} open={handler.browse}>
 
      {!handler.state.can('FIND') && <>The librarian is busy right now. Try again later.</>}

      {/* drawer toolbar */}
      <Flex
        spacing={1}
        sx={{ 
          p: 1,
        }}
      >
        <TinyButton icon="YouTube" />
        <Nowrap small>Saved videos</Nowrap>
        <Spacer />

        


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
      <Layout data-testid="test-for-TubeBrowser" small={small}>
        {groupKeys.map((key) => (
          <Stack> 

            <Flex spacing={1}>
              <TinyButton icon={groupIcons[key]}  
                color={ handler.expanded && handler.expanded[key] ? "error" : "inherit"}
              />
              <Nowrap muted={!(handler.expanded && handler.expanded[key])} small hover onClick={() => handleExpand(key)}>
                {key}
              </Nowrap>
            </Flex>
            
            <CategoryNode 
              groups={groups}
              groupKey={key}
              handler={handler}
              searchText={searchText}
              handlePlay={handlePlay}
              handleExpand={handleExpand}
              selectedItem={selectedItem}
            />  
          </Stack>
        ))}


        <Stack>


          <Flex muted={!(handler.expanded && handler.expanded.lists)} spacing={1}>
            <TinyButton icon="QueueMusic" />
            <Nowrap small hover onClick={() => handleExpand("lists")}>
              Playlists
            </Nowrap>
          </Flex>

                    

          <Collapse in={handler.expanded && handler.expanded.lists}>  
              {Object.keys(playlists).map((cat) => (

                <Stack sx={{ ml: 2 }}>

                  <Flex spacing={1}>
                    <TinyButton
                      icon="KeyboardArrowDown"
                      deg={
                        handler.expanded && handler.expanded[`lists/${cat}`]
                          ? 0
                          : 270
                      }
                    />
                    <Nowrap small hover onClick={() => handleExpand(`lists/${cat}`)}> 
                      {cat}
                    </Nowrap>
                  </Flex>

                  <Collapse in={handler.expanded && handler.expanded[`lists/${cat}`]}> 
                    {playlists[cat].map((item) => (
                      <CollectionItem 
                        searchText={searchText} 
                        group={playlists[cat]} 
                        handler={handler} 
                        item={item} 
                        caption={detailCaption}
                        handlePlay={handlePlay} 
                        selectedItem={selectedItem} 
                        key={item.tubekey} />  
                    ))}
                  </Collapse>


                </Stack>
              ))} 
            </Collapse>



            <Stack sx={{mt: 4}}>
              <Nowrap small muted > {formatBytesToKB(diskUsed)} of 5 MB used</Nowrap>
              <LinearProgress sx={{mb: 2}} variant="determinate" value={diskUsed / 500000} />
              <Nowrap small><a download="data.json" href={jsonLink(handler.pins)}>Download bookmarks</a></Nowrap>
              <HiddenUpload>Import bookmarks...</HiddenUpload>
            </Stack>
 
           

        </Stack>
  
      </Layout>
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



const CategoryMember = ({ handler, searchText, groups, groupKey, handleExpand, handlePlay, selectedItem, groupItem }) => {

  const expanded = handler.expanded && handler.expanded[`${groupKey}/${groupItem}`];

  const matchingMemberKids = !!handler.filter && groups[groupKey][groupItem]
        .some(f => contains(f.title, handler.filter) || 
        contains(f.artistName, handler.filter) || 
        contains(f.collectionName, handler.filter)  ) 


  return (

    <Stack sx={{ ml: 2 }}>
    <Flex spacing={1}>
      <TinyButton
        icon="KeyboardArrowDown"
        deg={
          expanded
            ? 0
            : 270
        }
      />
      <Nowrap
        small
      
        hover
        onClick={() => handleExpand(`${groupKey}/${groupItem}`)}
      >
        {' '}
        {groupItem} 
      </Nowrap>
    </Flex>

    <Collapse
      in={expanded || matchingMemberKids}
    >
      {/* collection tracks */}
      {(expanded || matchingMemberKids) && groups[groupKey][groupItem]
      .sort(sorter('trackNumber'))
      .map((item) => (
        <CollectionItem 
          searchText={searchText} 
          group={groups[groupKey][groupItem]} 
          handler={handler} 
          item={item} 
          caption={groupCaptions[groupKey]}
          handlePlay={handlePlay} 
          selectedItem={selectedItem} 
          key={item.trackId} /> 
        
      ))}
    </Collapse>


  </Stack>

  )
}



const CollectionItem = ({
  handler,
  caption,
  searchText,
  item,
  handlePlay,
  group,
  selectedItem,
}) => {

  return (
    <Flex sx={{ ml: 2 }} spacing={1}>
      <Avatar
        src={item.artworkUrl100}
        alt={item.title}
        sx={{ width: 32, height: 32 }}
      />
      <Stack>

        <Nostack
          color={selectedItem.href === item.tubekey ? 'error' : 'inherit'}
          bold={selectedItem.href === item.tubekey}
          onClick={() => handlePlay(item, group)} 
          hover
          small
        >
          {item.title}
        </Nostack>

        {!!caption && (
          <Nostack hover onClick={() => searchText(item.artistName)} muted small>
            {caption(item)}
          </Nostack>
        )}

      </Stack>
    </Flex>
  );
};
