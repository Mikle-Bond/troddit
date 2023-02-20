import localForage from "localforage";
import React, { useState, useContext, useEffect, useReducer } from "react";

export const localRead = localForage.createInstance({ storeName: "readPosts" });
export const localSeen = localForage.createInstance({ storeName: "seenPosts" });

export const localSubInfoCache = localForage.createInstance({
  storeName: "subInfoCache",
});
export const subredditFilters = localForage.createInstance({
  storeName: "subredditFilters",
});
export const userFilters = localForage.createInstance({
  storeName: "userFilters",
});

export const MainContext: any = React.createContext({});

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainProvider = ({ children }) => {
  const [pauseAll, setPauseAll] = useState(false); //pauses all media when a post is opened
  const [loading, setLoading] = useState(false); //used in feed to display load bar
  const [ready, setReady] = useState(false); //prevents any feed load until settings are loaded
  const [postOpen, setPostOpen] = useState(false); //using pauseAll instead..
  const [mediaMode, setMediaMode] = useState(false);
  const [uniformHeights, setUniformHeights] = useState<boolean>();
  const [highRes, setHighRes] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [columns, setColumns] = useState(3);
  const [posts, setPosts] = useState<[any?]>([]);
  const [postNum, setPostNum] = useState(0);
  const [token, setToken] = useState();
  const [gAfter, setGAfter] = useState("");
  const [safeSearch, setSafeSearch] = useState(true);
  const [volume, setVolume] = useState<number>(undefined);
  //const [forceRefresh, setForceRefresh] = useState(0);
  //update key whenever items may change for Masonic component
  const [progressKey, setProgressKey] = useState(0);
  const [fastRefresh, setFastRefresh] = useState(0);

  //settings. Initialized to undefined but defaults loaded in initial useEffect if previous setting not found
  const [nsfw, setNSFW] = useState<boolean>();
  const [autoplay, setAutoplay] = useState<boolean>();
  const [hoverplay, setHoverPlay] = useState<boolean>();
  const [columnOverride, setColumnOverride] = useState<number>();
  const [audioOnHover, setaudioOnHover] = useState<boolean>();
  const [autoHideNav, setAutoHideNav] = useState<boolean>();
  //controls how feed appears, switches to true when in multicolumn mode
  const [wideUI, setWideUI] = useState<boolean>();
  //saves toggle selection. Used to sync UI when switching back to 1 column. Also used to control postModal view
  const [saveWideUI, setSaveWideUI] = useState<boolean>();
  //if posts should also be wide ui/narrow ui
  const [syncWideUI, setSyncWideUI] = useState<boolean>(false);
  const [postWideUI, setPostWideUI] = useState<boolean>();
  //card style
  const [mediaOnly, setMediaOnly] = useState<boolean>();
  const [cardStyle, setCardStyle] = useState<string>("");
  
  //new settings..

  const [compactLinkPics, setCompactLinkPics] = useState<boolean>();
  const toggleCompactLinkPics = () => {
    setCompactLinkPics((c) => !c);
  };
  const [preferSideBySide, setPreferSideBySide] = useState<boolean>();
  const [disableSideBySide, setDisableSideBySide] = useState<boolean>();
  const togglePreferSideBySide = () => {
    setPreferSideBySide((p) => {
      if(!p) setDisableSideBySide(false); 
      return !p;
    });
  };
  const toggleDisableSideBySide = () => {
    setDisableSideBySide((p) => {
      if(!p) setPreferSideBySide(false); 
      return !p; 
    })
  }
  const [autoCollapseComments, setAutoCollapseComments] = useState<boolean>();
  const toggleAutoCollapseComments = () => {
    setAutoCollapseComments(a => !a);
  } 

  const [collapseChildrenOnly, setCollapseChildrenOnly] = useState<boolean>();
  const [defaultCollapseChildren, setDefaultCollapseChildren] =
    useState<boolean>();
  const [ribbonCollapseOnly, setRibbonCollapseOnly] = useState<boolean>();
  const [showUserIcons, setShowUserIcons] = useState<boolean>();
  const [showAwardings, setShowAwardings] = useState<boolean>();
  const [showFlairs, setShowFlairs] = useState<boolean>();
  const [showUserFlairs, setShowUserFlairs] = useState<boolean>();
  const [expandedSubPane, setExpandedSubPane] = useState<boolean>();
  const [infiniteLoading, setInfinitLoading] = useState<boolean>();
  const [dimRead, setDimRead] = useState<boolean>();
  const [autoRead, setAutoRead] = useState<boolean>();
  const [autoSeen, setAutoSeen] = useState<boolean>();

  const [disableEmbeds, setDisableEmbeds] = useState<boolean>();
  const [preferEmbeds, setPreferEmbeds] = useState<boolean>();
  const [embedsEverywhere, setEmbedsEveryWhere] = useState<boolean>();

  const [autoRefreshFeed, setAutoRefreshFeed] = useState<boolean>();
  const [autoRefreshComments, setAutoRefreshComments] = useState<boolean>();
  const [askToUpdateFeed, setAskToUpdateFeed] = useState<boolean>();
  const [refreshOnFocus, setRefreshOnFocus] = useState<boolean>();
  const [fastRefreshInterval, setFastRefreshInterval] = useState<number>();
  const [slowRefreshInterval, setSlowRefreshInterval] = useState<number>();
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>();
  const [waitForVidInterval, setWaitForVidInterval] = useState<boolean>();
  const [autoPlayMode, setAutoPlayMode] = useState<boolean>();
  const [defaultSortComments, setDefaultSortComments] = useState<string>();
  const toggleRibbonCollapseOnly = () => {
    setRibbonCollapseOnly((c) => !c);
  };
  const toggleDefaultCollapseChildren = () => {
    setDefaultCollapseChildren((d) => !d);
  };
  const toggleCollapseChildrenOnly = () => {
    if (!defaultCollapseChildren) {
      setCollapseChildrenOnly((d) => !d);
    }
  };
  useEffect(() => {
    defaultCollapseChildren && setCollapseChildrenOnly(true);
  }, [defaultCollapseChildren]);
  const toggleShowUserIcons = () => {
    setShowUserIcons((s) => !s);
  };
  const toggleShowAwardings = () => {
    setShowAwardings((s) => !s);
  };
  const toggleShowFlairs = () => {
    setShowFlairs((s) => !s);
  };
  const toggleShowUserFlairs = () => {
    setShowUserFlairs((s) => !s);
  };
  const toggleExpandedSubPane = () => {
    setExpandedSubPane((e) => !e);
  };
  const toggleInfiniteLoading = () => {
    setInfinitLoading((i) => !i);
  };
  const toggleDimRead = () => {
    setDimRead((d) => !d);
  };
  const toggleAutoRead = () => {
    setAutoRead((r) => !r);
  };
  const toggleAutoSeen = () => {
    setAutoSeen((r) => !r);
  };
  const toggleDisableEmbeds = () => {
    setDisableEmbeds((d) => {
      if (!d) {
        setPreferEmbeds(false);
        setEmbedsEveryWhere(false);
      }
      return !d;
    });
  };
  const togglePreferEmbeds = () => {
    setPreferEmbeds((p) => {
      if (!p) {
        setDisableEmbeds(false);
      }
      return !p;
    });
  };
  const toggleEmbedsEverywhere = () => {
    setEmbedsEveryWhere((e) => {
      if (!e) {
        setDisableEmbeds(false);
      }
      return !e;
    });
  };
  const toggleAutoHideNav = () => {
    setAutoHideNav((p) => !p);
  };

  //toggle for type of posts to show in saved screen
  const [userPostType, setUserPostType] = useState("links");
  const toggleUserPostType = () => {
    setUserPostType((p) => {
      if (p === "links") return "comments";
      return "links";
    });
  };

  const [readPosts, setReadPosts] = useState<{}>({});
  const [readPostsChange, setReadPostsChange] = useState<number>(0);
  const clearReadPosts = async () => {
    try {
      await localRead.clear();
      setReadPosts({});
      setReadPostsChange((n) => n + 1);
      return true;
    } catch (err) {
      return false;
    }
  };
  const bulkAddReadPosts = (posts: { postId; numComments }[]) => {
    setReadPosts((read) => {
      let now = new Date();
      let updatedRead = {};
      posts.forEach(({ postId, numComments }) => {
        updatedRead[postId] = { postId, numComments, time: now };
        localRead.setItem(postId, { postId, numComments, time: now });
      });
      //console.log("updated:", posts, updatedRead);

      if (Object.keys(read).length + Object.keys(updatedRead).length < 10000) {
        //console.log({...read, ...updatedRead});
        return { ...read, ...updatedRead };
      }
      //resetting object if space becomes too large

      return updatedRead;
    });
    setReadPostsChange((n) => n + 1);
  };
  const addReadPost = ({ postId, numComments }) => {
    localRead.setItem(postId, { postId, numComments, time: new Date() });
    setReadPosts((read) => {
      setReadPostsChange((n) => n + 1);

      if (Object.keys(read).length < 10000) {
        read[postId] = { postId, numComments, time: new Date() };
        return read;
      }
      //resetting object if space becomes too large
      let newread = {};
      newread[postId] = { postId, numComments, time: new Date() };

      return newread;
    });
  };
  const toggleReadPost = async ({ postId, numComments }) => {
    setReadPosts((read) => {
      if (read?.[postId]) {
        localRead.removeItem(postId);
        delete read[postId];
      } else {
        read[postId] = { postId, numComments, time: new Date() };
        localRead.setItem(postId, { postId, numComments, time: new Date() });
      }
      setReadPostsChange((n) => n + 1);

      return read;
    });
  };

  //filters in the inverse sense, true = allowed
  const [seenFilter, setSeenFilter] = useState<boolean>();

  const [readFilter, setReadFilter] = useState<boolean>();
  const [imgFilter, setImgFilter] = useState<boolean>();
  const [vidFilter, setVidFilter] = useState<boolean>();
  const [galFilter, setGalFilter] = useState<boolean>();
  const [selfFilter, setSelfFilter] = useState<boolean>();
  const [linkFilter, setLinkFilter] = useState<boolean>();
  const [nsfwPostFilter, setNsfwPostFilter] = useState<boolean>();
  // const [filterCount, setFilterCount] = useState(0);
  //advanced filters
  //'img' filters also apply to reddit videos since those have known res as well..
  const [imgPortraitFilter, setImgPortraitFilter] = useState<boolean>();
  const [imgLandscapeFilter, setImgLandScapeFilter] = useState<boolean>();
  const [imgResFilter, setImgResFilter] = useState(false);
  const [imgResXFilter, setImgResXFilter] = useState(0);
  const [imgResYFilter, setImgResYFilter] = useState(0);
  const [imgResExactFilter, setImgResExactFilter] = useState(false);
  const [scoreFilter, setScoreFilter] = useState(false);
  const [scoreFilterNum, setScoreFilterNum] = useState();
  const [scoreGreater, setScoreGreater] = useState(true);

  const [replyFocus, setReplyFocus] = useState(false);
  /*To keep subreddit/user filters responsive */
  const [updateFilters, setUpdateFilters] = useState(0);
  const toggleFilter = (filter) => {
    switch (filter) {
      case "seen":
        setSeenFilter((r) => !r);
        break;
      case "read":
        setReadFilter((r) => !r);
        break;
      case "images":
        //toggle off orientation filters if no videos and images
        if (imgFilter === true && vidFilter === false) {
          setImgPortraitFilter(false);
          setImgLandScapeFilter(false);
        }
        //toggle orientation filters on automatically if enabling images
        if (
          imgFilter === false &&
          vidFilter === false &&
          imgPortraitFilter === false &&
          imgLandscapeFilter === false
        ) {
          setImgPortraitFilter(true);
          setImgLandScapeFilter(true);
        }
        setImgFilter((i) => !i);
        break;
      case "videos":
        //toggle off orientation filters if no videos and images
        if (imgFilter === false && vidFilter === true) {
          setImgPortraitFilter(false);
          setImgLandScapeFilter(false);
        }
        //toggle orientation filter on automatically if enabling videos
        if (
          vidFilter === false &&
          imgFilter === false &&
          imgPortraitFilter === false &&
          imgLandscapeFilter === false
        ) {
          setImgPortraitFilter(true);
          setImgLandScapeFilter(true);
        }
        setVidFilter((v) => !v);
        break;
      case "galleries":
        setGalFilter((g) => !g);
        break;
      case "self":
        setSelfFilter((s) => !s);
        break;
      case "links":
        setLinkFilter((l) => !l);
        break;
      case "score":
        setScoreFilter((s) => !s);
        break;
      case "portrait":
        //if orientation toggled on and video+images toggled off, toggle them on
        if (
          imgPortraitFilter === false &&
          imgFilter === false &&
          vidFilter === false
        ) {
          setImgFilter(true);
          setVidFilter(true);
        }
        //if both orientations toggled off, also toggle off image/video filter
        if (imgPortraitFilter === true && imgLandscapeFilter === false) {
          setImgFilter(false);
          setVidFilter(false);
        }
        setImgPortraitFilter((p) => !p);
        break;
      case "landscape":
        //if orientation toggled on and video+images toggled off, toggle them on
        if (
          imgLandscapeFilter === false &&
          imgFilter === false &&
          vidFilter === false
        ) {
          setImgFilter(true);
          setVidFilter(true);
        }
        //if both orientations toggled off, also toggle off image/video filter
        if (imgLandscapeFilter === true && imgPortraitFilter === false) {
          setImgFilter(false);
          setVidFilter(false);
        }
        setImgLandScapeFilter((l) => !l);
        break;
      case "nsfw_filter":
        setNsfwPostFilter((x) => !x);
        break;
    }
  };

  const [filtersApplied, setApplyFilters] = useState(0);
  const applyFilters = (
    filters = {
      seenFilter,
      nsfwPostFilter,
      readFilter,
      imgFilter,
      vidFilter,
      selfFilter,
      linkFilter,
      imgPortraitFilter,
      imgLandscapeFilter,
    }
  ) => {
    //need filtersapplied number to be unique each time filters are applied to prevent shortening items array for Masonic when react-query updates stale feed
    //positive will be used to determine if any filters are active

    setApplyFilters((f) => {
      //any filter on
      if (Object.values(filters).some(x => x === false)) {
        return Math.abs(f) + 1;
      }
      return (Math.abs(f) + 1) * -1;
    });
    setProgressKey((p) => p + 1);
  };

  const updateLikes = (i, like) => {
    if (posts?.[i]?.data) {
      setPosts((p) => {
        p[i].data.likes = like;
        return p;
      });
    }
  };

  const updateSaves = (i, save) => {
    if (posts?.[i]?.data) {
      setPosts((p) => {
        p[i].data.saved = save;
        return p;
      });
    }
  };
  const updateHidden = (i, hidden) => {
    let p = posts;
    if (p?.[i]?.data) {
      setPosts((p) => {
        p[i].data.hidden = hidden;
        return p;
      });
    }
  };

  const [localSubs, setLocalSubs] = useState([]);
  const [localFavoriteSubs, setLocalFavoriteSubs] = useState([]);
  const subToSub = async (action, sub) => {
    if (action == "sub") {
      return await addLocalSub(sub);
    } else if (action == "unsub") {
      return await removeLocalSub(sub);
    } else return false;
  };
  const addLocalSub = async (sub) => {
    let found = localSubs.find((s) => s?.toUpperCase() === sub?.toUpperCase());
    if (!found) {
      setLocalSubs((p) => [...p, sub]);
    }
    return true;
  };
  const removeLocalSub = async (sub) => {
    setLocalSubs((p) => {
      let filtered = p.filter((s) => s?.toUpperCase() !== sub?.toUpperCase());
      if (!(filtered.length > 0)) {
        localStorage.removeItem("localSubs");
        localForage.setItem("localSubs", []);
      }
      return filtered;
    });
    return true;
  };
  const favoriteLocalSub = async (makeFavorite, subname) => {
    if (makeFavorite === true) {
      let found = localFavoriteSubs.find(
        (s) => s?.toUpperCase() === subname?.toUpperCase()
      );
      if (!found) {
        setLocalFavoriteSubs((p) => [...p, subname]);
      }
    } else {
      setLocalFavoriteSubs((p) => {
        let filtered = p.filter(
          (s) => s?.toUpperCase() !== subname?.toUpperCase()
        );
        if (!(filtered.length > 0)) {
          localForage.setItem("localFavoriteSubs", []);
        }
        return filtered;
      });
    }
  };

  const toggleAudioOnHover = () => {
    setaudioOnHover((a) => !a);
  };

  const toggleMediaOnly = () => {
    setMediaOnly((m) => !m);
  };

  //syncs wideui and savedwide ui
  const toggleWideUI = () => {
    setSaveWideUI((w) => {
      setWideUI(!w);
      syncWideUI && setPostWideUI(!w);
      return !w;
    });
  };
  //to force refresh feed so width set properly when in one column mode
  useEffect(() => {
    cardStyle !== "row1" &&
      columnOverride === 1 &&
      setFastRefresh((f) => f + 1);
  }, [wideUI]);

  const toggleSyncWideUI = () => {
    setSyncWideUI((w) => {
      if (!w) {
        setPostWideUI(saveWideUI);
      }
      return !w;
    });
  };

  const togglePostWideUI = () => {
    setPostWideUI((w) => !w);
  };

  const toggleNSFW = () => {
    setNSFW((prevNSFW) => !prevNSFW);
  };
  const toggleHoverPlay = () => {
    setHoverPlay((a) => !a);
  };
  const toggleAutoplay = () => {
    setAutoplay((a) => !a);
  };
  const toggleLoginModal = () => {
    setLoginModal((m) => !m);
  };

  useEffect(() => {
    const getSettings = async () => {
      //fall back to localstorage for legacy settings
      let fallback = false;
      function loaderForLegacySetting(name: string, setter: Function, prefer: boolean = true): Promise<void> {
        return async () => {
          let saved = await localForage.getItem(name);
          if (saved !== null) {
            saved === prefer ? setter(prefer) : setter(!prefer);
            localStorage.removeItem(name);
          } else {
            fallback = true;
            let local = localStorage.getItem(name);
            local?.includes(prefer ? "true" : "false") ? setter(prefer) : setter(!prefer);
          }
        }
      }

      const loadNSFW = loaderForLegacySetting("nsfw", setNSFW);
      const loadAutoplay = loaderForLegacySetting("autoplay", setAutoplay);
      const loadHoverPlay = loaderForLegacySetting("hoverplay", setHoverPlay);
      const loadMediaOnly = loaderForLegacySetting("mediaOnly", setMediaOnly);
      const audioOnHover = loaderForLegacySetting("audioOnHover", setaudioOnHover);

      const columnOverride = async () => {
        let saved_columnOverride: number = await localForage.getItem(
          "columnOverride"
        );
        if (saved_columnOverride !== null) {
          saved_columnOverride > 0
            ? setColumnOverride(saved_columnOverride)
            : setColumnOverride(0);
          localStorage.removeItem("columnOverride");
        } else {
          fallback = true;
          let local_columnOverride = parseInt(
            localStorage.getItem("columnOverride")
          );
          local_columnOverride > 0
            ? setColumnOverride(local_columnOverride)
            : setColumnOverride(0);
        }
      };

      const savedWideUI = loaderForLegacySetting("saveWideUI", setSaveWideUI, prefers = false);
      // const syncWideUI = loaderForLegacySetting("syncWideUI", setSyncWideUI, prefers = false);
      const postWideUI = loaderForLegacySetting("postWideUI", setPostWideUI, prefers = false);
      const loadWideUI = loaderForLegacySetting("wideUI", setWideUI, prefers = false);

      const loadCardStyle = async () => {
        let saved_cardStyle: string = await localForage.getItem("cardStyle");
        if (saved_cardStyle !== null) {
          saved_cardStyle && setCardStyle(saved_cardStyle);
          localStorage.removeItem("cardStyle");
        } else {
          fallback = true;
          let local_cardStyle = localStorage.getItem("cardStyle");
          local_cardStyle?.length > 0
            ? setCardStyle(saved_cardStyle)
            : setCardStyle("default");
        }
      };

      const loadLocalSubs = async () => {
        let saved_localSubs: [] = await localForage.getItem("localSubs");
        if (saved_localSubs !== null) {
          saved_localSubs && setLocalSubs(saved_localSubs);
          localStorage.removeItem("localSubs");
        } else {
          fallback = true;
          let local_localSubs = JSON.parse(localStorage.getItem("localSubs"));
          local_localSubs && setLocalSubs(local_localSubs);
        }
      };
      //new setting no fallback
      const loadLocalFavoriteSubs = async () => {
        let saved_favs: [] = await localForage.getItem("localFavoriteSubs");
        if (saved_favs !== null) {
          saved_favs && setLocalFavoriteSubs(saved_favs);
        }
      };

      let filters = {
        imgFilter: true,
        imgLandscapeFilter: true,
        imgPortraitFilter: true,
        linkFilter: true,
        nsfwPostFilter: true,
        readFilter: true,
        seenFilter: true, // new filter
        selfFilter: true,
        vidFilter: true,
      };

      function loaderForLegacyFilter (name: string, setter: Function): Promise<void> {
        return async () => {
          let saved_value = await localForage.getItem(name);
          if (saved_value !== null) {
            if (saved_value === false) {
              filters[name] = false;
              setter(false);
            } else {
              setter(true);
            }
            localStorage.removeItem(name);
          } else {
            fallback = true;
            let local_value = localStorage.getItem(name);
            if (local_value?.includes("false")) {
              filters[name] = false;
              setter(false);
            } else {
              setter(true);
            }
          }
        };
      }

      const loadImgFilter = loaderForLegacyFilter("imgFilter", setImgFilter);
      const loadImgLandscapeFilter = loaderForLegacyFilter("imgLandscapeFilter", setImgLandScapeFilter);
      const loadImgPortraitFilter = loaderForLegacyFilter("imgPortraitFilter", setImgPortraitFilter);
      const loadLinkFilter = loaderForLegacyFilter("linkFilter", setLinkFilter);
      const loadReadFilter = loaderForLegacyFilter("readFilter", setReadFilter);
      const loadSelfFilter = loaderForLegacyFilter("selfFilter", setSelfFilter);
      const loadVidFilter = loaderForLegacyFilter("vidFilter", setVidFilter);

      //new setting
      function loaderForFilter (name: string, setter: Function): Promise<void> {
        return async () => {
          let saved = await localForage.getItem(name);
          if (saved === false) {
            filters[name] = false;
            setter(false);
          } else {
            setter(true);
          }
        }
      }

      const loadSeenFilter = loaderForFilter("seenFilter", setSeenFilter);
      const loadNsfwPostFilter = loaderForFilter("nsfwPostFilter", setNsfwPostFilter);

      //new settings don't need localstorage fallback..
      function loaderForSettingBool(name: string, setter: Function, fallback: boolean): Promise<void> {
        return async () => {
          let saved = await localForage.getItem(name);
          saved === !fallback
            ? setter(!fallback)
            : setter(fallback);
        };
      }

      const loadRibbonCollapseOnly = loaderForSettingBool("ribbonCollapseOnly", setRibbonCollapseOnly, false);
      const loadCollapseChildrenOnly = loaderForSettingBool("collapseChildrenOnly", setCollapseChildrenOnly, false);
      const loadDefaultCollapseChildren = loaderForSettingBool("defaultCollapseChildren", setDefaultCollapseChildren, false);
      const loadShowUserIcons = loaderForSettingBool("showUserIcons", setShowUserIcons, true);
      const loadShowAwardings = loaderForSettingBool("showAwardings", setShowAwardings, true);
      const loadShowFlairs = loaderForSettingBool("showFlairs", setShowFlairs, true);
      const loadShowUserFlairs = loaderForSettingBool("showUserFlairs", setShowUserFlairs, true);
      const loadExpandedSubPane = loaderForSettingBool("expandedSubPane", setExpandedSubPane, false);
      const loadInfiniteLoading = loaderForSettingBool("infiniteLoading", setInfinitLoading, true);
      const loadDimRead = loaderForSettingBool("dimRead", setDimRead, true);
      const loadAutoRead = loaderForSettingBool("autoRead", setAutoRead, true);
      const loadAutoSeen = loaderForSettingBool("autoSeen", setAutoSeen, true);
      const loadDisableEmbeds = loaderForSettingBool("disableEmbeds", setDisableEmbeds, false);
      const loadPreferEmbeds = loaderForSettingBool("preferEmbeds", setPreferEmbeds, false);
      const loadEmbedsEverywhere = loaderForSettingBool("embedsEverywhere", setEmbedsEveryWhere, false);
      const autoRefreshFeed = loaderForSettingBool("autoRefreshFeed", setAutoRefreshFeed, true);
      const autoRefreshComments = loaderForSettingBool("autoRefreshComments", setAutoRefreshComments, true);
      const askToUpdateFeed = loaderForSettingBool("askToUpdateFeed", setAskToUpdateFeed, true);
      const refreshOnFocus = loaderForSettingBool("refreshOnFocus", setRefreshOnFocus, true);

      const loadVolume = async () => {
        let saved = await localForage.getItem("volume");
        if (saved >= 0 && saved <= 1 && typeof saved === "number") {
          setVolume(saved);
        } else {
          setVolume(0.5);
        }
      };
      const fastRefreshInterval = async () => {
        let saved = (await localForage.getItem(
          "fastRefreshInterval"
        )) as number;
        if (typeof saved === "number" && saved >= 10 * 1000) {
          setFastRefreshInterval(saved);
        } else {
          setFastRefreshInterval(30 * 1000);
        }
      };
      const slowRefreshInterval = async () => {
        let saved = (await localForage.getItem(
          "slowRefreshInterval"
        )) as number;
        if (typeof saved === "number" && saved >= 10 * 1000) {
          setSlowRefreshInterval(saved);
        } else {
          setSlowRefreshInterval(30 * 60 * 1000);
        }
      };
      const defaultSortComments = async () => {
        let saved = (await localForage.getItem(
            "defaultSortComments"
        )) as string;
        if (typeof saved === "string") {
            setDefaultSortComments(saved);
        } else {
            setDefaultSortComments("top");
        }
      };
      const autoPlayInterval = async () => {
        let saved = (await localForage.getItem("autoPlayInterval")) as number;
        if (typeof saved === "number" && saved >= 1) {
          setAutoPlayInterval(saved);
        } else {
          setAutoPlayInterval(5);
        }
      };

      const waitForVidInterval = loaderForSettingBool("waitForVidInterval", setWaitForVidInterval, true);
      const loadUniformHeights = loaderForSettingBool("uniformHeights", setUniformHeights, true);
      const compactLinkPics = loaderForSettingBool("compactLinkPics", setCompactLinkPics, true);
      const autoHideNav = loaderForSettingBool("autoHideNav", setAutoHideNav, false);
      const preferSideBySide = loaderForSettingBool("preferSideBySide", setPreferSideBySide, false);
      const disableSideBySide = loaderForSettingBool("disableSideBySide", setDisableSideBySide, false);
      const autoCollapseComments = loaderForSettingBool("autoCollapseComments", setAutoCollapseComments, true);

      //things we dont' really need loaded before posts are loaded
      autoCollapseComments(); 
      disableSideBySide(); 
      loadAutoRead();
      loadCollapseChildrenOnly();
      loadDefaultCollapseChildren();
      loadExpandedSubPane();
      loadRibbonCollapseOnly();
      loadShowUserFlairs();
      loadShowUserIcons();
      preferSideBySide(); 

      //things we need loaded before posts are rendered
      await Promise.all([
        //syncWideUI(),
        askToUpdateFeed(),
        audioOnHover(),
        autoHideNav(),
        autoPlayInterval(),
        autoRefreshComments(),
        autoRefreshFeed(),
        columnOverride(),
        compactLinkPics(),
        defaultSortComments(),
        fastRefreshInterval(),
        loadAutoSeen(),
        loadAutoplay(),
        loadCardStyle(),
        loadDimRead(),
        loadDisableEmbeds(),
        loadEmbedsEverywhere(),
        loadHoverPlay(),
        loadImgFilter(),
        loadImgLandscapeFilter(),
        loadImgPortraitFilter(),
        loadInfiniteLoading(),
        loadLinkFilter(),
        loadLocalFavoriteSubs(),
        loadLocalSubs(),
        loadMediaOnly(),
        loadNSFW(),
        loadNsfwPostFilter(),
        loadPreferEmbeds(),
        loadReadFilter(),
        loadSeenFilter(),
        loadSelfFilter(),
        loadShowAwardings(),
        loadShowFlairs(),
        loadUniformHeights(),
        loadVidFilter(),
        loadVolume(),
        loadWideUI(),
        postWideUI(),
        refreshOnFocus(),
        savedWideUI(),
        slowRefreshInterval(),
        waitForVidInterval(),
      ]);

      applyFilters(filters);

      //Not doing this as all read posts shoudn't be loaded into memory. Instead read posts are loaded into memory as needed in PostOptButton component or in filter in utils
      // let saved_readPosts = await localForage.getItem("readPosts");
      // if (saved_readPosts !== null) {
      //   //saved_readPosts && setReadPosts(saved_readPosts);
      //   localStorage.removeItem("readPosts");
      // }
      setReady(true);
    };

    getSettings();
  }, []);

  function saveSettings(settings) {
    function saveSetting(s: any, name: string) {
      useEffect(() => {
        if (s !== undefined) {
          localForage.setItem(name, s);
        }
      }, [s]);
    }
    Object.keys(settings).map((name) => saveSetting(settings[name], name))
  }

  saveSettings(
    settings = {
      autoCollapseComments,
      preferSideBySide,
      disableSideBySide,
      autoHideNav,
      uniformHeights,
      waitForVidInterval,
      autoPlayInterval,
      compactLinkPics,
      slowRefreshInterval,
      fastRefreshInterval,
      defaultSortComments,
      refreshOnFocus,
      askToUpdateFeed,
      autoRefreshComments,
      autoRefreshFeed,
      disableEmbeds,
      preferEmbeds,
      embedsEverywhere,
      autoSeen,
      autoRead,
      dimRead,
      infiniteLoading,
      expandedSubPane,
      showUserFlairs,
      showFlairs,
      showAwardings,
      showUserIcons,
      ribbonCollapseOnly,
      defaultCollapseChildren,
      collapseChildrenOnly,
      seenFilter,
      readFilter,
      imgFilter,
      imgPortraitFilter,
      imgLandscapeFilter,
      nsfwPostFilter,
      vidFilter,
      linkFilter,
      selfFilter,
      nsfw,
      autoplay,
      volume,
      hoverplay,
      columnOverride,
      saveWideUI,
      syncWideUI,
      postWideUI,
      wideUI,
      mediaOnly,
      audioOnHover,
    }
  )

  useEffect(() => {
    if (localSubs?.length > 0) {
      let encoded = encodeURIComponent(localSubs.join(","));
      //if we can fit this in the cookie
      if (encoded.length < 4000) {
        document.cookie = `localSubs=${encoded};samesite=strict;path=/`;
      }
      //otherwise fallback and will have to use indexed DB
      else {
        document.cookie = `localSubs=${true};samesite=strict`;
      }
      localForage.setItem("localSubs", localSubs);
    } else {
      document.cookie = `localSubs=false;samesite=strict`;
    }
  }, [localSubs]);

  useEffect(() => {
    if (localFavoriteSubs?.length > 0) {
      localForage.setItem("localFavoriteSubs", localFavoriteSubs);
    }
  }, [localFavoriteSubs]);

  useEffect(() => {
    if (cardStyle?.length > 0) {
      localForage.setItem("cardStyle", cardStyle);
    }
  }, [cardStyle]);

  return (
    <MainContext.Provider
      value={{
        nsfw,
        toggleNSFW,
        loginModal,
        toggleLoginModal,
        setLoginModal,
        autoplay,
        toggleAutoplay,
        hoverplay,
        toggleHoverPlay,
        columns,
        setColumns,
        wideUI,
        syncWideUI,
        postWideUI,
        setPostWideUI,
        setSyncWideUI,
        toggleSyncWideUI,
        togglePostWideUI,
        saveWideUI,
        toggleWideUI,
        setWideUI,
        columnOverride,
        setColumnOverride,
        mediaOnly,
        setMediaOnly,
        toggleMediaOnly,
        pauseAll,
        setPauseAll,
        audioOnHover,
        toggleAudioOnHover,
        cardStyle,
        setCardStyle,
        posts,
        setPosts,
        gAfter,
        setGAfter,
        postNum,
        setPostNum,
        localSubs,
        localFavoriteSubs,
        subToSub,
        favoriteLocalSub,
        token,
        setToken,
        updateLikes,
        updateSaves,
        updateHidden,
        //forceRefresh,
        //setForceRefresh,
        fastRefresh,
        setFastRefresh,
        ready,
        loading,
        setLoading,
        toggleFilter,
        seenFilter,
        readFilter,
        imgFilter,
        vidFilter,
        galFilter,
        linkFilter,
        selfFilter,
        imgResExactFilter,
        imgResFilter,
        imgLandscapeFilter,
        imgPortraitFilter,
        imgResXFilter,
        imgResYFilter,
        scoreFilter,
        scoreGreater,
        scoreFilterNum,
        replyFocus,
        setReplyFocus,
        userPostType,
        toggleUserPostType,
        readPosts,
        readPostsChange,
        addReadPost,
        bulkAddReadPosts,
        toggleReadPost,
        clearReadPosts,
        postOpen,
        setPostOpen,
        ribbonCollapseOnly,
        toggleRibbonCollapseOnly,
        collapseChildrenOnly,
        toggleCollapseChildrenOnly,
        defaultCollapseChildren,
        toggleDefaultCollapseChildren,
        showUserIcons,
        toggleShowUserIcons,
        showAwardings,
        toggleShowAwardings,
        showFlairs,
        toggleShowFlairs,
        showUserFlairs,
        toggleShowUserFlairs,
        expandedSubPane,
        toggleExpandedSubPane,
        infiniteLoading,
        toggleInfiniteLoading,
        dimRead,
        toggleDimRead,
        autoRead,
        toggleAutoRead,
        autoSeen,
        toggleAutoSeen,
        disableEmbeds,
        toggleDisableEmbeds,
        preferEmbeds,
        togglePreferEmbeds,
        embedsEverywhere,
        toggleEmbedsEverywhere,
        updateFilters,
        setUpdateFilters,
        applyFilters,
        filtersApplied,
        progressKey,
        setProgressKey,
        safeSearch,
        setSafeSearch,
        volume,
        setVolume,
        autoRefreshComments,
        setAutoRefreshComments,
        autoRefreshFeed,
        setAutoRefreshFeed,
        askToUpdateFeed,
        setAskToUpdateFeed,
        refreshOnFocus,
        setRefreshOnFocus,
        fastRefreshInterval,
        setFastRefreshInterval,
        slowRefreshInterval,
        setSlowRefreshInterval,
        autoPlayInterval,
        setAutoPlayInterval,
        waitForVidInterval,
        setWaitForVidInterval,
        mediaMode,
        setMediaMode,
        autoPlayMode,
        setAutoPlayMode,
        defaultSortComments,
        setDefaultSortComments,
        compactLinkPics,
        toggleCompactLinkPics,
        uniformHeights,
        setUniformHeights,
        highRes,
        setHighRes,
        autoHideNav,
        toggleAutoHideNav,
        disableSideBySide,
        toggleDisableSideBySide,
        preferSideBySide,
        togglePreferSideBySide,
        autoCollapseComments,
        toggleAutoCollapseComments
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
