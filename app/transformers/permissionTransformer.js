export const transformPermission = (permission)=>({

    id: permission.id,
    name: permission.name,
    slug: permission.slug,
    description: permission.description,
    created_at: permission.created_at,
    updated_at: permission.updated_at,

});

export const transformPermissions=(permissions=[])=>
    permissions.map(transformPermission);