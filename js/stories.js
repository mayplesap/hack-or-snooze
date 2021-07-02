"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if(currentUser) {
  //   getFavoriteIcon(story);

  // }
  // ${currentUser} ? true : other option;

  // <i class="${getFavoriteIcon(story)}"></i>

  return $(`
      <li id="${story.storyId}">
        ${(currentUser) ? getFavoriteIcon(story) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** submit form, adds a new story the DOM and API, hides submit form */
async function submitAndAddStory(evt) {
  evt.preventDefault();
  
  // grabs author, title, url
  const title = $newStoryTitle.val();
  const author = $newStoryAuthor.val();
  const url = $newStoryUrl.val();

  let newStory = await storyList.addStory(currentUser, {title, author, url});
  
  putStoryOnPage(newStory);
  currentUser.ownStories.push(newStory);

  $myStoriesList.prepend("hello");
  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
}

$newStoryForm.on("submit", submitAndAddStory)

/** get story from submit form and puts on page */
function putStoryOnPage(story) {
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
}

/** helper function to determine if favorite icon is needed and specify which one */
function getFavoriteIcon(story) {
  if (currentUser.inFavorites(story)) { 
    return `<i class="fas fa-star"></i>`;
  } else {
    return `<i class="far fa-star"></i>`;
  }
}

/** get currentuser's favorites list and adds to favorites list */
function populateFavoritesList(favorites) {
  $favoritesList.empty();
  for (let favorite of favorites) {
    let $favStory = generateStoryMarkup(favorite);
    $favoritesList.prepend($favStory);
  }
}

/** helper function to get story object using storyId */
function getStoryFromList(storyId, list) {
  for (let story of list) {
    if (storyId === story.storyId) {
      return story;
    }
  }
}

/** helper function to get ownStory using storyId */
function getOwnStories(storyId) {
  for (let story of currentUser.ownStories) {
    if (storyId === story.storyId) {
      return story;
    }
  }
}

/** handles favoriteclick event by changing favorite icon and
 *  adding/removing favorite
 */
async function favoriteClick(evt) {
  let storyId = $(evt.target).closest("li")[0].id; // .closest("li").eq(0).attr("id")
  if (evt.target.className === "fas fa-star") {
    let story = getStoryFromList(storyId, currentUser.favorites);
    evt.target.className = "far fa-star"
    currentUser.removeFavorite(story);
  } else {

    // need to check API for specific story in case the story is no longer in storyList
    const response = await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "GET"
    });

    let { title, author, url, username, createdAt } = response.data.story;

    let story = new Story({storyId, title, author, url, username, createdAt});
    evt.target.className = "fas fa-star"
    currentUser.addFavorite(story);
  }
}

// /** get all stories from API */ <------- UNFIXABLE BUG CAUSE API

// async function getAllStories() {
//   const response = await axios({
//     url: `${BASE_URL}/stories`,
//     method: "GET",
//     data: { token: currentUser.loginToken,
//       params: { limit: 1000 }
//   }});
//   return response;
// }

$(".stories-list").on("click", ".fa-star", favoriteClick);

/** get the stories currentUser submitted and adds to ownStories list */

function populateMyStoriesList(ownStories) {
  $myStoriesList.empty();
  for (let myStory of ownStories) {
    let $ownStory = generateStoryMarkup(myStory);
    $myStoriesList.prepend($ownStory);
  }
  addTrashIcon();

}

/** adds trash icons to stories in my-story-list */
function addTrashIcon() {
  for (let storyLi of Array.from($myStoriesList.children())){
    //debugger
    let $icon = "<i class='fas fa-trash-alt'></i>";
    $(storyLi).prepend($icon);
  }
}

/** handles trash can clicking by deleting the story from user/api */
function trashcanClick(evt) {
  let storyId = $(evt.target).closest("li").eq(0).attr("id");
  let story = getStoryFromList(storyId, currentUser.ownStories);
  currentUser.deleteStory(story);
  $(evt.target).parent().remove();
}

$("#my-stories-list").on("click", ".fa-trash-alt", trashcanClick)

// COULDN'T GET THIS TO WORK 1ST ICON ATTEMPT
// function populateFavoriteIcons() {
//   // console.log($allStoriesList.children());
//   let favoriteIds = {};
//   for (let fStory of currentUser.favorites) {
//     favoriteIds[fStory.storyId] = true;
//   }
//   for (let storyLi of Array.from($allStoriesList.children())) {
//     let $icon = getIconMarkup(storyLi.storyId, favoriteIds)
//     storyLi.prepend($($icon));
//     // if (storyLi.storyId in favoriteIds) {
//     //   storyLi.prepend($(`<i class="fas fa-star"></i>`));
//     // } else {
//     //   storyLi.prepend($(`<i class="far fa-star"></i>`));
//     // }
//   }
// }

// function getIconMarkup(storyId, favoriteIds) {
//   if (storyId in favoriteIds) {
//     return `<i class="fas fa-star"></i>`;
//   } else {
//     return `<i class="far fa-star"></i>`;
//   }
// }

