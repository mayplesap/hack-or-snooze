"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit form on click on "submit" */

function navSubmitClick() {
  $newStoryForm.show();
  $allStoriesList.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show favorites section on click on "favorites" */

function navFavoritesClick() {
  populateFavoritesList(currentUser.favorites);
  hidePageComponents();
  $favoritesList.show();
}

$navFavorites.on("click", navFavoritesClick);

/** Show my stories section on click on "my stories" */

function navMyStoryClick() {
  populateMyStoriesList(currentUser.ownStories);
  hidePageComponents();
  $myStoriesList.show();
}

$navMyStories.on("click", navMyStoryClick);
