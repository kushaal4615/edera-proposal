import { SiAndroid, SiApple, SiExpress, SiFigma, SiFirebase, SiGooglemaps, SiJsonwebtokens, SiMongodb, SiNodedotjs, SiReact, SiRedux, SiStripe, SiTypescript } from '@icons-pack/react-simple-icons'
import type { IconType } from '@icons-pack/react-simple-icons'

const MAP: Record<string, IconType> = {
  react: SiReact,
  reactnative: SiReact,
  typescript: SiTypescript,
  nodedotjs: SiNodedotjs,
  express: SiExpress,
  mongodb: SiMongodb,
  redux: SiRedux,
  jwt: SiJsonwebtokens,
  firebase: SiFirebase,
  googlemaps: SiGooglemaps,
  stripe: SiStripe,
  figma: SiFigma,
  apple: SiApple,
  android: SiAndroid,
}

/** A technology's brand mark in the current ink. Marks simple-icons does not ship (AWS, S3) are typeset as a struck label. */
export function BrandMark({ icon, name, size = 22 }: { icon: string; name: string; size?: number }) {
  const Icon = MAP[icon]
  if (Icon) return <Icon size={size} color="currentColor" title={name} />
  return (
    <span role="img" aria-label={name} className="mono grid place-items-center rounded-[var(--r-card)] border-[1.5px] border-current px-1 text-[0.625rem] font-bold leading-none" style={{ height: size, minWidth: size }}>
      {icon === 'aws' ? 'AWS' : icon === 's3' ? 'S3' : name.slice(0, 3).toUpperCase()}
    </span>
  )
}
