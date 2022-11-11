export const meCollectionsURL = `/api/@me/collections`
export const profileImageURL = `/api/@me/profile`

export const collectionsURL = `/api/collections`

export const galleryURL = `/api/gallery`
export const galleryCollectionManageURL = (imageId: string) => `/api/gallery/${imageId}/collection`
export const galleryDetailURL = (id: string) => `/api/gallery/${id}`
export const galleryUploadURL = `/api/gallery/upload`
export const galleryUploadImageURL = `/api/gallery/upload-image`
