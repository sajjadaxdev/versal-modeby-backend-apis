import { formatDateTime } from "../helpers/dateHelper.js";

const mapFranchise = (franchise = {}) => ({

    id: Number(franchise.id),
    business_id: Number(franchise.business_id),

    business_name: franchise.business_name,

    name: franchise.name,
    code: franchise.code,
    address: franchise.address,
    total_vehicle: franchise.vehicle_count,
    ownership_type: franchise.ownership_type,
    is_head_office: Boolean(franchise.is_head_office),
    is_active: Boolean(franchise.is_active),

    created_at: formatDateTime(franchise.created_at),
    updated_at: formatDateTime(franchise.updated_at),

});

export const transformFranchise = (franchise) => mapFranchise(franchise);

export const transformFranchises = (franchises = []) => franchises.map(mapFranchise);