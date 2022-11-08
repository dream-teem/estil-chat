export interface ImageWithThumbnails <T extends readonly number[]> {
  original: string;
  thumbnails: Record<T[number], string>;
}

export interface SaveImageThumbnailsOptions<T extends readonly number[]> {
  dir: string;
  thumbnailSizes: T;
  format?: string;
}
