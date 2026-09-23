import { alt, renderShareCard, size } from "./share-card";

export { alt, size };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return renderShareCard();
}
