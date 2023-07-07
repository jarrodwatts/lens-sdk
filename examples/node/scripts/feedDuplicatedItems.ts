import { FeedItemFragment } from "@lens-protocol/client";
import { getAuthenticatedClient } from "./shared/getAuthenticatedClient";
import { setupWallet } from "./shared/setupWallet";

const arr = [];

export const findDuplicates = (feedItem: FeedItemFragment): void => {
  const commentsKey = feedItem.comments?.map((comment) => comment.id).join(",") ?? "";
  const mirrorsKeys = feedItem.mirrors?.map((event) => event.timestamp).join(",") ?? "";
  const collectsKey = feedItem.collects?.map((event) => event.timestamp).join(",") ?? "";
  const reactionsKey = feedItem.reactions?.map((event) => event.timestamp).join(",") ?? "";
  const mirrorId = feedItem.electedMirror?.mirrorId ?? "";

  const id = [
    feedItem.root.id,
    "___",
    commentsKey,
    mirrorsKeys,
    collectsKey,
    reactionsKey,
    mirrorId,
  ].join("-");

  if (arr.includes(id)) {
    console.log("duplicate", id);
  } else {
    arr.push(id);
  }
};

async function main() {
  const wallet = setupWallet();
  const lensClient = await getAuthenticatedClient(wallet);
  const profileId = "0x05";

  // fetch your feed
  const feedResult = await lensClient.feed.fetch(
    {
      profileId,
      limit: 50,
    },
    profileId
  );

  const feedItems = feedResult.unwrap();

  feedItems.items.forEach(findDuplicates);

  while (feedItems.pageInfo.next) {
    console.log(`Fetching page for cursor: ${feedItems.pageInfo.next}`);

    const nextPage = await feedItems.next();
    console.log(nextPage.items.length);

    nextPage.items.forEach(findDuplicates);
  }
}

main();
