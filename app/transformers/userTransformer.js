import { formatDateTime } from "../helpers/dateHelper.js";

const mapUser = (user = {}) => ({
    id: user.id,
    franchise_id: user.franchise_id,
    franchise_name: user.franchises_name,
    username: user.username,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar,
    is_active: Boolean(user.is_active),
    created_at: formatDateTime(user.created_at),
    updated_at: formatDateTime(user.updated_at),
    roles: user.roles
});

export const transformUser = (user) => mapUser(user);

export const transformUsers = (users = []) => users.map(mapUser);
