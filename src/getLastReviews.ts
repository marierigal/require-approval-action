import { getOctokit } from '@actions/github';
import { REVIEW_STATE } from './constants';
import { ListReviewsParams, Review, SortedReviews } from './types';

export async function getLastReviews(
  token: string,
  params: ListReviewsParams
): Promise<SortedReviews> {
  const octokit = getOctokit(token);

  const { data: reviews } = await octokit.pulls.listReviews(params);

  const reviewsByUser: Record<string, Review> = {};
  for (const review of reviews) {
    if (
      review.user &&
      (review.state === REVIEW_STATE.approved ||
        review.state === REVIEW_STATE.changesRequested)
    ) {
      reviewsByUser[review.user.id] = review;
    }
  }

  const lastReviews: SortedReviews = {
    approved: [],
    changesRequested: [],
  };

  for (const review of Object.values(reviewsByUser)) {
    switch (review.state) {
      case REVIEW_STATE.approved:
        lastReviews.approved.push(review);
        break;

      case REVIEW_STATE.changesRequested:
        lastReviews.changesRequested.push(review);
        break;

      default:
        break;
    }
  }

  return lastReviews;
}
