import { withPluginApi } from "discourse/lib/plugin-api";

// http://github.com/yixizhang/seed-shuffle
function shuffle(array, seed) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  seed = seed || 1;
  let random = function() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function initializeDiscourseRandomInviteesList(api) {
  api.decorateCookedElement(
    (cooked, helper) => {
      if (helper) {
        const post = helper.getModel();
        const wrap = cooked.querySelector("span[data-wrap=random-invitees]");

        if (
          post.event &&
          post.event.is_ongoing &&
          wrap &&
          post.event.sample_invitees.length
        ) {
          const usernames = post.event.sample_invitees
            .filter(x => x.status === "going")
            .mapBy("user.username");
          const seed = moment(post.event.starts_at.valueOf());
          const shuffledUsernames = shuffle(usernames, seed);
          const list = shuffledUsernames.map(s => `<li>${s}</li>`);
          wrap.innerHTML = `<h4>Order</h4><ul>${list.join("")}</ul>`;
        } else if (wrap) {
          wrap.innerHTML = "";
        }
      }
    },
    { onlyStream: true, id: "discourse-random-invitees-list" }
  );
}

export default {
  name: "discourse-random-invitees-list",

  initialize() {
    withPluginApi("0.8.24", initializeDiscourseRandomInviteesList);
  }
};
