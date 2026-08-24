import { formatDateTime } from "../helpers/dateHelper.js";

const mapBusiness = (business = {}) => ({

    id: Number(business.id),

    name: business.name,
    slug: business.slug,

    email: business.email,
    phone: business.phone,
    address: business.address,

    logo: business.logo,
    logoFull: business.logoFull,

    franchise_count: Number(business.franchise_count || 0),

    is_active: Boolean(business.is_active),

    created_at: formatDateTime(business.created_at),
    updated_at: formatDateTime(business.updated_at),

});

export const transformBusiness = (business) => mapBusiness(business);

export const transformBusinesses = (businesses = []) =>
    businesses.map(mapBusiness);