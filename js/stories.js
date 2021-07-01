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
// function getFavoriteIcon(story) {
//   let favoriteIcon = "fas fa-star";
//   let notFavoriteIcon = "far fa-star";

//   // TODO: CHANGE TO FINDINDEX
//   if (currentUser.favorites.indexOf(story) != -1) {
//     return favoriteIcon;
//   } else {
//     return notFavoriteIcon;
//   }
// }

