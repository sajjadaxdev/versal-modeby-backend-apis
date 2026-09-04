export const transformRating = (rating) => {

    if (!rating) {
        return null;
    }

    return {
        id: Number(rating.id),
        rideId: Number(rating.ride_id),
        ratedBy: Number(rating.rated_by),
        ratedUser: Number(rating.rated_user),
        rating: Number(rating.score),
        comment: rating.comment,
        createdAt: rating.created_at,
    };

};