export const riderTransformer = (rider) => ({

    id: Number(rider.id),
    user_id: Number(rider.user_id),
    preferred_payment: rider.preferred_payment,
    created_at: rider.created_at,
    updated_at: rider.updated_at,

});