type ImageCardProps = {
  imageUrl: string
  caption?: string
}

export default function ImageCard({ imageUrl, caption }: ImageCardProps) {
  return (
    <figure className="w-[250px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow">
      <img className="w-full object-contain aspect-[4/3]" src={imageUrl} alt="image" />
      {
        caption && (
          <figcaption className="border-t-2 text-mtext border-border p-4">
            {caption}
          </figcaption>
        )
      }
    </figure>
  )
}
