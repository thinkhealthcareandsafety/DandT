import Image, { type ImageProps } from 'next/image'
import type { Media } from '@/lib/content/types'

type PhotoProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'placeholder' | 'blurDataURL'> & {
  media: Media
  /** Fill the positioned parent instead of sizing from the photo's own dimensions. */
  fill?: boolean
}

/**
 * A content photo: fades in from its blur placeholder and keeps the owner's chosen focal point in
 * frame when it's cropped.
 */
export function Photo({ media, fill, style, ...props }: PhotoProps) {
  return (
    <Image
      src={media.src}
      {...(fill || !media.width ? { fill: true } : { width: media.width, height: media.height })}
      placeholder={media.blur ? 'blur' : 'empty'}
      blurDataURL={media.blur}
      style={{ objectPosition: media.focus, ...style }}
      {...props}
    />
  )
}
